const express = require('express');
const router = express.Router();
const Product = require('../schemas/products');
const OrderItem = require('../schemas/orderItems');
const CartItem = require('../schemas/cartItems');
const { protect, optionalProtect, admin } = require('../utils/auth');

router.route('/').post(protect, admin, async (req, res) => {
    const {
        name,
        price,
        description,
        stock,
        images,
        category_id,
        brand_id,
        is_visible
    } = req.body;

    try {
        const product = new Product({
            name,
            price,
            description,
            stock,
            images,
            category_id,
            brand_id,
            is_visible: typeof is_visible === 'boolean' ? is_visible : true
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).get(optionalProtect, async (req, res) => {
    try {
        const isAdminUser = req.user && req.user.role_id && req.user.role_id.name === 'ADMIN';
        const filter = isAdminUser ? {} : { $or: [{ is_visible: true }, { is_visible: { $exists: false } }] };
        const products = await Product.find(filter).populate('category_id', 'name').populate('brand_id', 'name');
        res.json(products);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id').get(optionalProtect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id', 'name').populate('brand_id', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const isAdminUser = req.user && req.user.role_id && req.user.role_id.name === 'ADMIN';
        if (product.is_visible === false && !isAdminUser) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        res.json(product);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).put(protect, admin, async (req, res) => {
    const {
        name,
        price,
        description,
        stock,
        images,
        category_id,
        brand_id,
        is_visible
    } = req.body;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (stock !== undefined) product.stock = stock;
        if (images !== undefined) product.images = images;
        if (category_id !== undefined) product.category_id = category_id;
        if (brand_id !== undefined) product.brand_id = brand_id;
        if (typeof is_visible === 'boolean') product.is_visible = is_visible;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).delete(protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const hasOrders = await OrderItem.exists({ product_id: req.params.id });
        if (hasOrders) {
            return res.status(400).json({
                message: 'Không thể xoá sản phẩm này vì đã có đơn hàng liên quan. Vui lòng sử dụng tính năng "Ẩn" để ngừng kinh doanh.'
            });
        }

        await CartItem.deleteMany({ product_id: req.params.id });
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Đã xoá sản phẩm' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
