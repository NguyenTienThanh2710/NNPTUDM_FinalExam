const Review = require('../models/review.model');
const Product = require('../models/product.model');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    const { product_id, rating, comment } = req.body;

    try {
        const product = await Product.findById(product_id);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const alreadyReviewed = await Review.findOne({
            user_id: req.user._id,
            product_id: product_id
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        const review = new Review({
            user_id: req.user._id,
            product_id,
            rating: Number(rating),
            comment
        });

        await review.save();

        // Update product's average rating and number of reviews
        const reviews = await Review.find({ product_id });
        product.num_reviews = reviews.length;
        product.avg_rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await product.save();

        res.status(201).json({ message: 'Đã thêm đánh giá' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        // Check if user is the owner of the review or an admin
        const isAdmin = req.user && req.user.role_id && req.user.role_id.name === 'ADMIN';
        if (review.user_id.toString() !== req.user._id.toString() && !isAdmin) {
            return res.status(403).json({ message: 'Bạn không có quyền xoá đánh giá này' });
        }

        const product_id = review.product_id;
        await Review.deleteOne({ _id: req.params.id });

        // Update product's average rating and number of reviews
        const product = await Product.findById(product_id);
        const reviews = await Review.find({ product_id });

        if (reviews.length > 0) {
            product.num_reviews = reviews.length;
            product.avg_rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        } else {
            product.num_reviews = 0;
            product.avg_rating = 0;
        }

        await product.save();

        res.json({ message: 'Đã xoá đánh giá' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get reviews by product ID
// @route   GET /api/reviews/product/:productId
// @access  Public
const getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId })
            .populate('user_id', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    addReview,
    deleteReview,
    getReviewsByProduct
};
