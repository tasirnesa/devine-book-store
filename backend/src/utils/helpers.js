const slugifyLib = require('slugify');

/**
 * Generate a URL-safe slug from a string
 */
exports.slugify = (text) =>
    slugifyLib(text, { lower: true, strict: true, trim: true });

/**
 * Pick only listed keys from an object (avoid sending sensitive fields)
 */
exports.pick = (obj, keys) =>
    keys.reduce((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key];
        return acc;
    }, {});

/**
 * Convert MB to bytes
 */
exports.mbToBytes = (mb) => mb * 1024 * 1024;

/**
 * Get ISO date string from a Date or string
 */
exports.toISODate = (date) => new Date(date).toISOString().split('T')[0];
