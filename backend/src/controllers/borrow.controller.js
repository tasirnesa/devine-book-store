const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');

/**
 * Issue a book to a user
 * POST /api/admin/borrow/issue
 */
exports.issueBook = async (req, res, next) => {
    try {
        const { bookId, userId, dueDate } = req.body;

        // Check if book exists
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        if (!book) return error(res, 'Book not found', 404);

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
        if (!user) return error(res, 'User not found', 404);

        // Create borrowing record
        const borrowing = await prisma.borrowing.create({
            data: {
                bookId: parseInt(bookId),
                userId: parseInt(userId),
                dueDate: new Date(dueDate),
                status: 'ISSUED'
            },
            include: {
                book: {
                    include: {
                        translations: {
                            where: { language: { code: 'en' } },
                            take: 1
                        }
                    }
                },
                user: true
            }
        });

        return success(res, borrowing, 'Book issued successfully', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * Return a book
 * POST /api/admin/borrow/return/:id
 */
exports.returnBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { returnDate } = req.body;

        const borrowing = await prisma.borrowing.findUnique({
            where: { id: parseInt(id) }
        });

        if (!borrowing) return error(res, 'Borrowing record not found', 404);
        if (borrowing.status === 'RETURNED') return error(res, 'Book already returned', 400);

        // Calculate fine (logic can be expanded based on settings)
        const dateReturned = returnDate ? new Date(returnDate) : new Date();
        let fineAmount = 0;
        if (dateReturned > borrowing.dueDate) {
            const diffTime = Math.abs(dateReturned - borrowing.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fineAmount = diffDays * 5; // Default 5 units per day, can fetch from Settings
        }

        const updated = await prisma.borrowing.update({
            where: { id: parseInt(id) },
            data: {
                returnDate: dateReturned,
                status: 'RETURNED',
                fineAmount
            }
        });

        return success(res, updated, 'Book returned successfully');
    } catch (err) {
        next(err);
    }
};

/**
 * Get all borrowing records (with filters)
 * GET /api/admin/borrow
 */
exports.getBorrowingHistory = async (req, res, next) => {
    try {
        const { status, userId, bookId } = req.query;
        
        const where = {};
        if (status) where.status = status;
        if (userId) where.userId = parseInt(userId);
        if (bookId) where.bookId = parseInt(bookId);

        const records = await prisma.borrowing.findMany({
            where,
            include: {
                book: {
                    include: {
                        translations: {
                            where: { language: { code: 'en' } },
                            take: 1
                        }
                    }
                },
                user: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return success(res, records);
    } catch (err) {
        next(err);
    }
};

/**
 * Get overdue books
 * GET /api/admin/borrow/overdue
 */
exports.getOverdueBooks = async (req, res, next) => {
    try {
        const now = new Date();
        const records = await prisma.borrowing.findMany({
            where: {
                status: 'ISSUED',
                dueDate: { lt: now }
            },
            include: {
                book: {
                    include: {
                        translations: {
                            where: { language: { code: 'en' } },
                            take: 1
                        }
                    }
                },
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        return success(res, records);
    } catch (err) {
        next(err);
    }
};
