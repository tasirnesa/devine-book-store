const Language = require('../models/Language');

exports.getAllLanguages = async () => {
    return Language.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
};

exports.createLanguage = async (data) => {
    return Language.create(data);
};

exports.updateLanguage = async (id, data) => {
    const lang = await Language.findByPk(id);
    if (!lang) return null;
    return lang.update(data);
};

exports.deleteLanguage = async (id) => {
    await Language.destroy({ where: { id } });
};
