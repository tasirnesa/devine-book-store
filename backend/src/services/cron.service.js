const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendDueDateReminder } = require('./mail.service');
const logger = require('../config/logger');

/**
 * Initialize all cron jobs
 */
const initCronJobs = () => {
    // Run every day at 08:00 AM
    cron.schedule('0 8 * * *', async () => {
        logger.info('Running daily due date check...');
        await checkUpcomingDueDates();
    });

    logger.info('Cron jobs initialized');
};

/**
 * Check for borrowings due in 3 days or 1 day
 */
const checkUpcomingDueDates = async () => {
    try {
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);

        const oneDayFromNow = new Date(today);
        oneDayFromNow.setDate(today.getDate() + 1);

        // Find all active borrowings that are not returned
        const activeBorrowings = await prisma.borrowing.findMany({
            where: {
                returnDate: null,
                status: 'ISSUED',
                dueDateReminderSent: false,
                dueDate: {
                    lte: threeDaysFromNow,
                    gte: today
                }
            },
            include: {
                user: true,
                book: {
                    include: {
                        translations: true
                    }
                }
            }
        });

        for (const borrowing of activeBorrowings) {
            const dueDate = new Date(borrowing.dueDate);
            const timeDiff = dueDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysRemaining <= 3 && daysRemaining > 0) {
                // Get English title for the reminder
                const enTranslation = borrowing.book.translations.find(t => t.languageId === 1) || borrowing.book.translations[0];
                
                logger.info(`Sending reminder for book "${enTranslation.title}" to ${borrowing.user.email}`);
                
                await sendDueDateReminder(
                    borrowing.user, 
                    { title: enTranslation.title, dueDate: borrowing.dueDate.toLocaleDateString() }, 
                    daysRemaining
                );

                // Update borrowing record
                if (daysRemaining === 1) {
                    await prisma.borrowing.update({
                        where: { id: borrowing.id },
                        data: { dueDateReminderSent: true }
                    });
                }
            }
        }
    } catch (error) {
        logger.error(`Cron error: ${error.message}`);
    }
};

module.exports = {
    initCronJobs,
};
