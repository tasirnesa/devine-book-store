const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const slugify = require('slugify');

/**
 * Get all authors
 */
exports.getAllAuthors = async (req, res, next) => {
    try {
        const authors = await prisma.author.findMany({
            orderBy: { name: 'asc' }
        });
        return success(res, authors);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new author
 */
exports.createAuthor = async (req, res, next) => {
    try {
        const { name, bio, photoUrl } = req.body;
        const slug = slugify(name, { lower: true });
        
        const author = await prisma.author.create({
            data: { name, slug, bio, photoUrl }
        });
        
        return success(res, author, 'Author created successfully', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * Update an author
 */
exports.updateAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, bio, photoUrl } = req.body;
        const updateData = { name, bio, photoUrl };
        
        if (name) {
            updateData.slug = slugify(name, { lower: true });
        }
        
        const author = await prisma.author.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        
        return success(res, author, 'Author updated successfully');
    } catch (err) {
        next(err);
    }
};

/**
 * Delete an author
 */
exports.deleteAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.author.delete({
            where: { id: parseInt(id) }
        });
        return success(res, null, 'Author deleted successfully');
    } catch (err) {
        next(err);
    }
};
