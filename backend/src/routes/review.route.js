const express = require('express');
const router = express.Router();
const { addReview, deleteReview, getReviewsByProduct } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, addReview);
router.delete('/:id', protect, deleteReview);
router.get('/product/:productId', getReviewsByProduct);

module.exports = router;
