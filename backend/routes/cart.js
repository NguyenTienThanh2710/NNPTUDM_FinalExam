const express = require('express');
const router = express.Router();
const Cart = require('../schemas/carts');
const CartItem = require('../schemas/cartItems');
const Product = require('../schemas/products');
const { protect } = require('../utils/auth');

router.use(protect);

router.route('/').get(async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id });
        }
        const items = await CartItem.find({ cart_id: cart._id }).populate('product_id', 'name price images stock');
        res.json({ cart_id: cart._id, items });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).post(async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id });
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id });
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const requestedQuantity = currentQuantity + parseInt(quantity);

        if (product.stock < requestedQuantity) {
            return res.status(400).json({
                message: `Chỉ còn ${product.stock} sản phẩm trong kho. Bạn đã có ${currentQuantity} trong giỏ.`
            });
        }

        if (cartItem) {
            cartItem.quantity = requestedQuantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ cart_id: cart._id, product_id, quantity: requestedQuantity });
        }

        res.status(201).json(cartItem);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).delete(async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        if (cart) {
            await CartItem.deleteMany({ cart_id: cart._id });
        }
        res.json({ message: 'Đã xoá toàn bộ giỏ hàng' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id').put(async (req, res) => {
    const { quantity } = req.body;
    try {
        const cartItem = await CartItem.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        const cart = await Cart.findById(cartItem.cart_id);
        if (String(cart.user_id) !== req.user.id) {
            return res.status(401).json({ message: 'Không có quyền thực hiện' });
        }

        const product = await Product.findById(cartItem.product_id);
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Không thể cập nhật. Chỉ còn ${product.stock} sản phẩm trong kho.` });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.json(cartItem);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).delete(async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        const cart = await Cart.findById(cartItem.cart_id);
        if (String(cart.user_id) !== req.user.id) {
            return res.status(401).json({ message: 'Không có quyền thực hiện' });
        }

        await cartItem.deleteOne();
        res.json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
