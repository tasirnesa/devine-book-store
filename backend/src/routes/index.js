const express = require('express');
const router = express.Router();

router.use('/books', require('./book.routes'));
router.use('/languages', require('./language.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));

router.use('/categories', require('./category.routes'));
router.use('/admin', require('./admin.routes'));

// API health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
