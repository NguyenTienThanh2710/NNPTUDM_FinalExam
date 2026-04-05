const express = require('express');
const router = express.Router();
const { addReview, deleteReview, getReviewsByProduct, canReview, getAllReviews } = require('../controllers/review.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/', protect, addReview);
router.delete('/:id', protect, deleteReview);
router.get('/product/:productId', getReviewsByProduct);
router.get('/can-review/:productId', protect, canReview);
router.get('/all', protect, admin, getAllReviews);

module.exports = router;
