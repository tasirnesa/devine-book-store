const Joi = require('joi');

exports.createBookSchema = Joi.object({
    title: Joi.string().max(255).optional(),
    slug: Joi.string().max(255).optional(),
    description: Joi.string().optional(),
    authorName: Joi.string().optional(),
    languageId: Joi.number().integer().optional(),
    coverUrl: Joi.string().optional(),
    fileUrl: Joi.string().optional(),
    externalUrl: Joi.string().optional(),
    featured: Joi.boolean().optional(),
    isbn: Joi.string().max(50).optional(),
    quantity: Joi.number().integer().min(0).optional(),
    publishedAt: Joi.date().optional(),
    authorId: Joi.number().integer().optional(),
    translations: Joi.array().items(
        Joi.object({
            languageId: Joi.number().integer().required(),
            title: Joi.string().required(),
            description: Joi.string().optional(),
            authorName: Joi.string().optional(),
        })
    ).optional(),
    categories: Joi.array().items(Joi.number().integer()).optional(),
});

exports.updateBookSchema = Joi.object({
    title: Joi.string().max(255).optional(),
    description: Joi.string().optional(),
    authorName: Joi.string().optional(),
    languageId: Joi.number().integer().optional(),
    coverUrl: Joi.string().optional(),
    fileUrl: Joi.string().optional(),
    externalUrl: Joi.string().optional(),
    featured: Joi.boolean().optional(),
    isbn: Joi.string().max(50).optional(),
    quantity: Joi.number().integer().min(0).optional(),
    publishedAt: Joi.date().optional(),
    authorId: Joi.number().integer().optional(),
    translations: Joi.array().items(
        Joi.object({
            languageId: Joi.number().integer().required(),
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            authorName: Joi.string().optional(),
        })
    ).optional(),
    categories: Joi.array().items(Joi.number().integer()).optional(),
});
