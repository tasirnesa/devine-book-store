const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createBookSchema, updateBookSchema } = require('../validators/book.validator');
const multer = require('multer');
const path = require('path');
const env = require('../config/env');

// Multer config for cover image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(env.upload.dir, 'covers')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
    storage,
    limits: { fileSize: env.upload.maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
    },
});

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:slug', bookController.getBookBySlug);

// Admin-only routes
router.post('/', protect, requireRole('ADMIN'), upload.single('cover'), validate(createBookSchema), bookController.createBook);
router.put('/:id', protect, requireRole('ADMIN'), upload.single('cover'), validate(updateBookSchema), bookController.updateBook);
router.delete('/:id', protect, requireRole('ADMIN'), bookController.deleteBook);

module.exports = router;
