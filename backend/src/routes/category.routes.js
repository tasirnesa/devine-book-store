const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.get('/', categoryController.getAllCategories);

// Protected CRUD routes
router.post('/', protect, requireRole('ADMIN'), categoryController.createCategory);
router.put('/:id', protect, requireRole('ADMIN'), categoryController.updateCategory);
router.delete('/:id', protect, requireRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;
