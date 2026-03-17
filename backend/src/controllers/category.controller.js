const prisma = require('../config/prisma');
const { success } = require('../utils/response');
const slugify = require('slugify');

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return success(res, categories);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new category
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name, icon } = req.body;
        const slug = slugify(name, { lower: true });
        
        const category = await prisma.category.create({
            data: { name, slug, icon }
        });
        
        return success(res, category, 'Category created successfully', 201);
    } catch (err) {
        next(err);
    }
};

/**
 * Update a category
 */
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        const updateData = { name, icon };
        
        if (name) {
            updateData.slug = slugify(name, { lower: true });
        }
        
        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        
        return success(res, category, 'Category updated successfully');
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a category
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        return success(res, null, 'Category deleted successfully');
    } catch (err) {
        next(err);
    }
};
