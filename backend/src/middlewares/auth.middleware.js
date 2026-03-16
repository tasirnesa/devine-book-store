const authService = require('../services/auth.service');
const { error } = require('../utils/response');

/**
 * Protect middleware — verifies JWT and attaches req.user
 */
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'Not authenticated. Please log in.', 401);
        }
        const token = authHeader.split(' ')[1];
        req.user = await authService.verifyToken(token);
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return error(res, 'Invalid or expired token', 401);
        }
        next(err);
    }
};
