/**
 * Unified API response helpers
 * All controllers use these instead of calling res.json() directly.
 */

exports.success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
};

exports.error = (res, message = 'Error', statusCode = 400) => {
    return res.status(statusCode).json({ success: false, message, data: null });
};

exports.paginated = (res, data, total, page, pageSize) => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    });
};
