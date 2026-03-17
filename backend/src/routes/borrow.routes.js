const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// All routes require admin
router.use(protect, requireRole('ADMIN'));

router.get('/', borrowController.getBorrowingHistory);
router.get('/overdue', borrowController.getOverdueBooks);
router.post('/issue', borrowController.issueBook);
router.post('/return/:id', borrowController.returnBook);

module.exports = router;
