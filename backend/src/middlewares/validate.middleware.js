/**
 * validate.middleware.js
 * Joi validation middleware — validates req.body against a given schema.
 * Usage: router.post('/', validate(mySchema), controller.method)
 */

const { error } = require('../utils/response');

exports.validate = (schema) => (req, res, next) => {
    const { error: validationError, value } = schema.validate(req.body, {
        abortEarly: false,  // collect ALL errors, not just the first
        stripUnknown: true,   // silently remove unknown keys
    });

    if (validationError) {
        const messages = validationError.details.map((d) => d.message);
        return error(res, messages.join('. '), 422);
    }

    // Replace req.body with the stripped/coerced value from Joi
    req.body = value;
    next();
};
