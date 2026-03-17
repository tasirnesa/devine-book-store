const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.get('/', authorController.getAllAuthors);

// Protected CRUD routes
router.post('/', protect, requireRole('ADMIN'), authorController.createAuthor);
router.put('/:id', protect, requireRole('ADMIN'), authorController.updateAuthor);
router.delete('/:id', protect, requireRole('ADMIN'), authorController.deleteAuthor);

module.exports = router;
