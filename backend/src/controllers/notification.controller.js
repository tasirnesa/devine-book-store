const notificationService = require('../services/notification.service');
const { success } = require('../utils/response');

/**
 * GET /api/notifications
 */
exports.getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.id);
        return success(res, notifications);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/notifications/unread-count
 */
exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.id);
        return success(res, { count });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res, next) => {
    try {
        await notificationService.markAsRead(req.params.id, req.user.id);
        return success(res, null, 'Notification marked as read');
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res, next) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        return success(res, null, 'All notifications marked as read');
    } catch (err) {
        next(err);
    }
};
