/**
 * Shared constants across the backend
 */

exports.ROLES = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
});

exports.SUPPORTED_LOCALES = Object.freeze(['en', 'ar', 'am', 'om']);

exports.LANGUAGE_DIRECTIONS = Object.freeze({
    en: 'ltr',
    ar: 'rtl',
    am: 'ltr',
    om: 'ltr',
});

exports.DEFAULT_PAGE_SIZE = 20;
exports.MAX_PAGE_SIZE = 100;
