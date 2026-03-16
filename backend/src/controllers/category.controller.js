const prisma = require('../config/prisma');
const { success } = require('../utils/response');

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
