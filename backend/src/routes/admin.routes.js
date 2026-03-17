const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// All routes here require admin privileges
router.use(protect, requireRole('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUser);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);
router.get('/users/:id/history', adminController.getUserBorrowHistory);
router.get('/settings', adminController.getSettings);
router.patch('/settings', adminController.updateSettings);

module.exports = router;
