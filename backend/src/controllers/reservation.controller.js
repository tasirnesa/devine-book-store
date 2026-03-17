const reservationService = require('../services/reservation.service');
const logger = require('../config/logger');

/**
 * Handle reservation creation
 */
const createReservation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required' });
        }

        const reservation = await reservationService.createReservation(userId, bookId);
        res.status(201).json(reservation);
    } catch (error) {
        logger.error(`Create Reservation Error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Handle fetching user reservations
 */
const getUserReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await reservationService.getUserReservations(userId);
        res.status(200).json(reservations);
    } catch (error) {
        logger.error(`Get Reservations Error: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch reservations' });
    }
};

/**
 * Handle reservation cancellation
 */
const cancelReservation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await reservationService.cancelReservation(userId, id);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Cancel Reservation Error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Handle fetching all reservations (Admin only)
 */
const getAdminReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getAdminReservations();
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        logger.error(`Get Admin Reservations Error: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch reservations' });
    }
};

/**
 * Handle fulfilling a reservation
 */
const fulfillReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { dueDate } = req.body;

        if (!dueDate) {
            return res.status(400).json({ message: 'Due date is required' });
        }

        const borrowing = await reservationService.fulfillReservation(id, dueDate);
        res.status(200).json({ success: true, data: borrowing, message: 'Reservation fulfilled successfully' });
    } catch (error) {
        logger.error(`Fulfill Reservation Error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createReservation,
    getUserReservations,
    cancelReservation,
    getAdminReservations,
    fulfillReservation,
};
