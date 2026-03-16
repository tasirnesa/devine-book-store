const express = require('express');
const router = express.Router();
const languageController = require('../controllers/language.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.get('/', languageController.getAllLanguages);
router.post('/', protect, requireRole('admin'), languageController.createLanguage);
router.put('/:id', protect, requireRole('admin'), languageController.updateLanguage);
router.delete('/:id', protect, requireRole('admin'), languageController.deleteLanguage);

module.exports = router;
