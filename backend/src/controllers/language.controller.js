const { success, error } = require('../utils/response');
const languageService = require('../services/language.service');

// GET /api/languages
exports.getAllLanguages = async (req, res, next) => {
    try {
        const languages = await languageService.getAllLanguages();
        return success(res, languages);
    } catch (err) {
        next(err);
    }
};

// POST /api/languages  [admin only]
exports.createLanguage = async (req, res, next) => {
    try {
        const lang = await languageService.createLanguage(req.body);
        return success(res, lang, 'Language created', 201);
    } catch (err) {
        next(err);
    }
};

// PUT /api/languages/:id  [admin only]
exports.updateLanguage = async (req, res, next) => {
    try {
        const lang = await languageService.updateLanguage(req.params.id, req.body);
        if (!lang) return error(res, 'Language not found', 404);
        return success(res, lang, 'Language updated');
    } catch (err) {
        next(err);
    }
};

// DELETE /api/languages/:id  [admin only]
exports.deleteLanguage = async (req, res, next) => {
    try {
        await languageService.deleteLanguage(req.params.id);
        return success(res, null, 'Language deleted');
    } catch (err) {
        next(err);
    }
};
