const { error } = require('../utils/response');

/**
 * Role guard — use after protect middleware
 * Usage: requireRole('admin') or requireRole('admin', 'moderator')
 */
exports.requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return error(res, 'Forbidden: insufficient permissions', 403);
        }
        next();
    };
};
