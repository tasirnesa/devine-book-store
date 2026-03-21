const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { protect } = require('../middlewares/auth.middleware');

// All favorite routes are protected
router.use(protect);

router.post('/toggle', favoriteController.toggleFavorite);
router.get('/', favoriteController.getMyFavorites);
router.get('/:bookId/check', favoriteController.checkIsFavorited);

module.exports = router;
