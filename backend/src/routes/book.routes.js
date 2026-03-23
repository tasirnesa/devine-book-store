const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createBookSchema, updateBookSchema } = require('../validators/book.validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

// Use absolute paths for upload directories
const UPLOAD_ROOT = path.join(__dirname, '..', '..', env.upload.dir);
const COVERS_DIR = path.join(UPLOAD_ROOT, 'covers');
const MANUSCRIPTS_DIR = path.join(UPLOAD_ROOT, 'manuscripts');

// Ensure directories exist
[COVERS_DIR, MANUSCRIPTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer config for cover image and manuscript uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = file.fieldname === 'cover' ? COVERS_DIR : MANUSCRIPTS_DIR;
        cb(null, dest);
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = {
            'cover': /jpeg|jpg|png|webp/,
            'file': /pdf|epub/
        };
        const allowed = allowedTypes[file.fieldname];
        if (allowed && allowed.test(path.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${file.fieldname}`));
        }
    },
});

const bookUpload = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

/**
 * Normalize multipart/form-data body before Joi validation.
 * Multer stores all fields as strings and doesn't parse bracket notation.
 */
const normalizeBookBody = (req, res, next) => {
    const b = req.body;

    // Handle 'categories[]' bracket notation -> 'categories' array of integers
    if (b['categories[]'] !== undefined) {
        const raw = b['categories[]'];
        b.categories = (Array.isArray(raw) ? raw : [raw]).map(Number).filter(Boolean);
        delete b['categories[]'];
    } else if (b.categories !== undefined) {
        const raw = b.categories;
        b.categories = (Array.isArray(raw) ? raw : [raw]).map(Number).filter(Boolean);
    }

    // Coerce numeric string fields to numbers
    if (b.languageId) b.languageId = Number(b.languageId);
    if (b.quantity) b.quantity = Number(b.quantity);
    if (b.authorId) b.authorId = Number(b.authorId);

    next();
};

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:slug', bookController.getBookBySlug);

// Admin-only routes
router.post('/', protect, requireRole('ADMIN'), bookUpload, normalizeBookBody, validate(createBookSchema), bookController.createBook);
router.put('/:id', protect, requireRole('ADMIN'), bookUpload, normalizeBookBody, validate(updateBookSchema), bookController.updateBook);
router.delete('/:id', protect, requireRole('ADMIN'), bookController.deleteBook);

module.exports = router;
