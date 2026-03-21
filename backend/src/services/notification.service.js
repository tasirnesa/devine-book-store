const prisma = require('../config/prisma');

/**
 * Create a new notification for a user
 */
const createNotification = async (userId, type, message, link = null) => {
    return await prisma.notification.create({
        data: {
            userId: parseInt(userId),
            type,
            message,
            link
        }
    });
};

/**
 * Get all notifications for a user
 */
const getUserNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit to last 50
    });
};

/**
 * Get unread notification count for a user
 */
const getUnreadCount = async (userId) => {
    return await prisma.notification.count({
        where: {
            userId: parseInt(userId),
            isRead: false
        }
    });
};

/**
 * Mark a specific notification as read
 */
const markAsRead = async (notificationId, userId) => {
    return await prisma.notification.updateMany({
        where: {
            id: parseInt(notificationId),
            userId: parseInt(userId)
        },
        data: { isRead: true }
    });
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
    return await prisma.notification.updateMany({
        where: { userId: parseInt(userId) },
        data: { isRead: true }
    });
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
