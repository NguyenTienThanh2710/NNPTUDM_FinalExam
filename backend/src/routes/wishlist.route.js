const express = require('express');
const router = express.Router();
const {
    getWishlist,
    toggleWishlist,
    checkInWishlist
} = require('../controllers/wishlist.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All wishlist routes are protected

router.route('/')
    .get(getWishlist);

router.route('/toggle')
    .post(toggleWishlist);

router.route('/check/:productId')
    .get(checkInWishlist);

module.exports = router;
