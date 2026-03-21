const favoriteService = require('../services/favorite.service');
const logger = require('../config/logger');

/**
 * Toggle favorite status for a book
 */
const toggleFavorite = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const result = await favoriteService.toggleFavorite(req.user.id, parseInt(bookId));
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        logger.error('Error toggling favorite:', error);
        next(error);
    }
};

/**
 * Get all favorited books for current user
 */
const getMyFavorites = async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';
        const favorites = await favoriteService.getUserFavorites(req.user.id, lang);
        res.status(200).json({
            success: true,
            data: favorites
        });
    } catch (error) {
        logger.error('Error fetching favorites:', error);
        next(error);
    }
};

/**
 * Check if a specific book is favorited
 */
const checkIsFavorited = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const isFavorited = await favoriteService.isFavorited(req.user.id, parseInt(bookId));
        res.status(200).json({
            success: true,
            data: { isFavorited }
        });
    } catch (error) {
        logger.error('Error checking favorite status:', error);
        next(error);
    }
};

module.exports = {
    toggleFavorite,
    getMyFavorites,
    checkIsFavorited
};
