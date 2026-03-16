const prisma = require('../config/prisma');
const { success } = require('../utils/response');

/**
 * Get dashboard statistics
 */
exports.getStats = async (req, res, next) => {
    try {
        const [totalBooks, totalUsers, totalCategories] = await Promise.all([
            prisma.book.count(),
            prisma.user.count(),
            prisma.category.count()
        ]);

        // Get recent books with translations
        const recentBooks = await prisma.book.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                translations: {
                    where: { language: { code: 'en' } },
                    take: 1
                }
            }
        });

        return success(res, {
            counts: {
                books: totalBooks,
                users: totalUsers,
                categories: totalCategories
            },
            recentBooks
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                isActive: true,
                preferredLanguage: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return success(res, users);
    } catch (err) {
        next(err);
    }
};
