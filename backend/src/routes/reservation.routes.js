const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// Public/Seeker routes
router.post('/', protect, reservationController.createReservation);
router.get('/my', protect, reservationController.getUserReservations);
router.put('/:id/cancel', protect, reservationController.cancelReservation);

// Admin-only routes
router.get('/admin', protect, requireRole('ADMIN'), reservationController.getAdminReservations);
router.get('/admin/pending-count', protect, requireRole('ADMIN'), reservationController.getPendingCount);
router.post('/:id/fulfill', protect, requireRole('ADMIN'), reservationController.fulfillReservation);

module.exports = router;
