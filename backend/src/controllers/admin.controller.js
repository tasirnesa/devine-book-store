const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const bcrypt = require('bcryptjs');

/**
 * Get dashboard statistics
 */
exports.getStats = async (req, res, next) => {
    try {
        const [totalBooks, totalUsers, totalCategories, borrowedCount] = await Promise.all([
            prisma.book.count(),
            prisma.user.count(),
            prisma.category.count(),
            prisma.borrowing.count({ where: { status: 'ISSUED' } })
        ]);

        return success(res, {
            counts: {
                books: totalBooks,
                availableBooks: totalBooks - borrowedCount,
                borrowedBooks: borrowedCount,
                users: totalUsers,
                categories: totalCategories
            },
            // Get recent books with translations
            recentBooks: await prisma.book.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    translations: {
                        where: { language: { code: 'en' } },
                        take: 1
                    }
                }
            })
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

/**
 * Create a new user (Admin only)
 */
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: (role || 'USER').toUpperCase()
            }
        });

        return success(res, user, 'User created successfully', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * Update user (Admin only)
 */
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const updateData = {
            name,
            email,
            role: role ? role.toUpperCase() : undefined
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return success(res, user, 'User updated successfully');
    } catch (err) {
        next(err);
    }
};

/**
 * Toggle user active status (Admin only)
 */
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        
        if (!user) return error(res, 'User not found', 404);

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { isActive: !user.isActive }
        });

        return success(res, updatedUser, `User ${updatedUser.isActive ? 'unblocked' : 'blocked'} successfully`);
    } catch (err) {
        next(err);
    }
};

/**
 * Get user borrow history (Admin only)
 */
exports.getUserBorrowHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const history = await prisma.borrowing.findMany({
            where: { userId: parseInt(id) },
            include: {
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

        return success(res, history);
    } catch (err) {
        next(err);
    }
};

/**
 * Get all system settings
 * GET /api/admin/settings
 */
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});
        return success(res, settingsMap);
    } catch (err) {
        next(err);
    }
};

/**
 * Update system settings
 * PATCH /api/admin/settings
 */
exports.updateSettings = async (req, res, next) => {
    try {
        const updates = req.body; // { key: value, ... }
        
        const operations = Object.entries(updates).map(([key, value]) => 
            prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            })
        );

        await Promise.all(operations);
        
        return success(res, null, 'Settings updated successfully');
    } catch (err) {
        next(err);
    }
};
