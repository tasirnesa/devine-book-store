const logger = require('../config/logger');

/**
 * Global error handler — must be last middleware in Express
 */
module.exports = (err, req, res, next) => {
    // Log server-side
    logger.error(err.stack || err.message);

    const statusCode = err.status || err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
};
