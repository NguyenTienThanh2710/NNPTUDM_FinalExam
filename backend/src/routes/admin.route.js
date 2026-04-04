const express = require('express');
const router = express.Router();
const { getWishlistStats } = require('../controllers/wishlist.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   GET /api/admin/stats/wishlist
// @desc    Get top wishlisted products
// @access  Private/Admin
router.get('/stats/wishlist', protect, admin, getWishlistStats);

module.exports = router;
