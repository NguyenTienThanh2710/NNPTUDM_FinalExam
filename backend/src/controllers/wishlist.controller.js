const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ user_id: req.user.id })
            .populate('product_id');

        res.status(200).json({
            success: true,
            count: wishlistItems.length,
            data: wishlistItems.map(item => item.product_id)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ'
        });
    }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mã sản phẩm'
            });
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const existingItem = await Wishlist.findOne({
            user_id: req.user.id,
            product_id
        });

        if (existingItem) {
            await Wishlist.findByIdAndDelete(existingItem._id);
            return res.status(200).json({
                success: true,
                message: 'Đã xoá khỏi danh sách yêu thích',
                isWishlisted: false
            });
        } else {
            await Wishlist.create({
                user_id: req.user.id,
                product_id
            });
            return res.status(201).json({
                success: true,
                message: 'Đã thêm vào danh sách yêu thích',
                isWishlisted: true
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ'
        });
    }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkInWishlist = async (req, res) => {
    try {
        const item = await Wishlist.findOne({
            user_id: req.user.id,
            product_id: req.params.productId
        });

        res.status(200).json({
            success: true,
            isInWishlist: !!item
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ'
        });
    }
};
