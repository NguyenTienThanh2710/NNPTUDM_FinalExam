const express = require('express');
const router = express.Router();
const Review = require('../schemas/reviews');
const Product = require('../schemas/products');
const Order = require('../schemas/orders');
const OrderItem = require('../schemas/orderItems');
const { protect, admin } = require('../utils/auth');

const REVIEW_ELIGIBLE_STATUSES = ['shipped', 'delivered'];

const hasPurchasedProduct = async (userId, productId) => {
    const orders = await Order.find({ user_id: userId, status: { $in: REVIEW_ELIGIBLE_STATUSES } }).select('_id');
    if (!orders.length) return false;
    const orderIds = orders.map((order) => order._id);
    const item = await OrderItem.findOne({ order_id: { $in: orderIds }, product_id: productId });
    return !!item;
};

router.post('/', protect, async (req, res) => {
    const { product_id, rating, comment } = req.body;
    try {
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const alreadyReviewed = await Review.findOne({ user_id: req.user._id, product_id });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        const purchased = await hasPurchasedProduct(req.user._id, product_id);
        if (!purchased) {
            return res.status(403).json({ message: 'Chỉ người dùng có đơn hàng đang giao hoặc đã giao mới có thể đánh giá.' });
        }

        const review = new Review({
            user_id: req.user._id,
            product_id,
            rating: Number(rating),
            comment
        });
        await review.save();

        const reviews = await Review.find({ product_id });
        product.num_reviews = reviews.length;
        product.avg_rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await product.save();

        res.status(201).json({ message: 'Đã thêm đánh giá' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        const isAdminUser = req.user && req.user.role_id && req.user.role_id.name === 'ADMIN';
        if (String(review.user_id) !== String(req.user._id) && !isAdminUser) {
            return res.status(403).json({ message: 'Bạn không có quyền xoá đánh giá này' });
        }

        const product_id = review.product_id;
        await Review.deleteOne({ _id: req.params.id });

        const product = await Product.findById(product_id);
        const reviews = await Review.find({ product_id });
        if (product) {
            if (reviews.length > 0) {
                product.num_reviews = reviews.length;
                product.avg_rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            } else {
                product.num_reviews = 0;
                product.avg_rating = 0;
            }
            await product.save();
        }

        res.json({ message: 'Đã xoá đánh giá' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId }).populate('user_id', 'name avatar').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.get('/can-review/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const alreadyReviewed = await Review.findOne({ user_id: req.user._id, product_id: productId });
        const purchased = await hasPurchasedProduct(req.user._id, productId);

        return res.json({
            canReview: purchased && !alreadyReviewed,
            alreadyReviewed: !!alreadyReviewed,
            message: alreadyReviewed
                ? 'Bạn đã đánh giá sản phẩm này rồi.'
                : purchased
                    ? 'Bạn có thể đánh giá sản phẩm này.'
                    : 'Chỉ người dùng có đơn hàng đang giao hoặc đã giao mới có thể đánh giá.'
        });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.get('/all', protect, admin, async (_req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user_id', 'name email')
            .populate('product_id', 'name images')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
