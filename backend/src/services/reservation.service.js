const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const notificationService = require('./notification.service');

/**
 * Create a new reservation
 */
const createReservation = async (userId, bookId) => {
    // Check if book exists
    const book = await prisma.book.findUnique({
        where: { id: parseInt(bookId) }
    });

    if (!book) {
        throw new Error('Book not found');
    }

    // Check if user already has an active reservation for this book
    const existing = await prisma.reservation.findFirst({
        where: {
            userId: parseInt(userId),
            bookId: parseInt(bookId),
            status: 'PENDING'
        }
    });

    if (existing) {
        throw new Error('You already have a pending reservation for this book');
    }

    // Create reservation
    return await prisma.reservation.create({
        data: {
            userId: parseInt(userId),
            bookId: parseInt(bookId),
            status: 'PENDING'
        },
        include: {
            book: {
                include: {
                    translations: true
                }
            }
        }
    });
};

/**
 * Get user reservations
 */
const getUserReservations = async (userId) => {
    return await prisma.reservation.findMany({
        where: { userId: parseInt(userId) },
        include: {
            book: {
                include: {
                    translations: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Cancel a reservation
 */
const cancelReservation = async (userId, reservationId) => {
    const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(reservationId) }
    });

    if (!reservation) {
        throw new Error('Reservation not found');
    }

    if (reservation.userId !== parseInt(userId)) {
        throw new Error('Unauthorized');
    }

    return await prisma.reservation.update({
        where: { id: parseInt(reservationId) },
        data: { status: 'CANCELLED' }
    });
};

/**
 * Notify reserved users when a book becomes available
 */
const notifyReservations = async (bookId) => {
    const reservations = await prisma.reservation.findMany({
        where: {
            bookId: parseInt(bookId),
            status: 'PENDING'
        },
        include: {
            user: true,
            book: {
                include: {
                    translations: true
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    if (reservations.length === 0) return;

    // For now, we notify the first person in line
    const topReservation = reservations[0];
    
    // Integration with mail service would happen here
    // const { sendBookAvailableNotification } = require('./mail.service');
    // await sendBookAvailableNotification(topReservation.user, topReservation.book);

    await prisma.reservation.update({
        where: { id: topReservation.id },
        data: { status: 'NOTIFIED' }
    });

    await notificationService.createNotification(
        topReservation.userId,
        'RESERVATION_READY',
        `The book "${topReservation.book.translations[0]?.title || topReservation.book.slug}" is now available for pickup!`,
        '/dashboard?tab=reservations'
    );

    return topReservation;
};

/**
 * Get all reservations (Admin only)
 */
const getAdminReservations = async () => {
    return await prisma.reservation.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            book: {
                include: {
                    translations: {
                        where: { language: { code: 'en' } },
                        take: 1
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Fulfill a reservation (convert to borrowing)
 */
const fulfillReservation = async (reservationId, dueDate) => {
    const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(reservationId) },
        include: { 
            user: true, 
            book: {
                include: {
                    translations: {
                        where: { language: { code: 'en' } },
                        take: 1
                    }
                }
            }
        }
    });

    if (!reservation) {
        throw new Error('Reservation not found');
    }

    if (reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') {
        throw new Error('Reservation already processed');
    }

    // Use a transaction to ensure both operations succeed
    return await prisma.$transaction(async (tx) => {
        // 1. Create borrowing record
        const borrowing = await tx.borrowing.create({
            data: {
                bookId: reservation.bookId,
                userId: reservation.userId,
                dueDate: new Date(dueDate),
                status: 'ISSUED'
            }
        });

        // 2. Mark reservation as completed
        await tx.reservation.update({
            where: { id: parseInt(reservationId) },
            data: { status: 'COMPLETED' }
        });

        // 3. Create notification for the user
        await notificationService.createNotification(
            reservation.userId,
            'RESERVATION_APPROVED',
            `Your reservation for "${reservation.book.translations[0]?.title || reservation.book.slug}" has been approved!`,
            '/dashboard?tab=loans'
        );

        return borrowing;
    });
};

/**
 * Get count of pending and notified reservations (Admin only)
 */
const getPendingReservationsCount = async () => {
    return await prisma.reservation.count({
        where: {
            status: {
                in: ['PENDING', 'NOTIFIED']
            }
        }
    });
};

module.exports = {
    createReservation,
    getUserReservations,
    cancelReservation,
    notifyReservations,
    getAdminReservations,
    fulfillReservation,
    getPendingReservationsCount,
};
