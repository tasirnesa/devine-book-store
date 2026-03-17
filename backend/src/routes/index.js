const express = require('express');
const router = express.Router();

router.use('/books', require('./book.routes'));
router.use('/languages', require('./language.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));

router.use('/categories', require('./category.routes'));
router.use('/authors', require('./author.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/admin/borrow', require('./borrow.routes'));
router.use('/reservations', require('./reservation.routes'));

// API health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
