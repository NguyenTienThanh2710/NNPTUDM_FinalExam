const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');

// @desc    Get user's cart and items
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id });
        }

        const items = await CartItem.find({ cart_id: cart._id }).populate('product_id', 'name price images stock');
        
        res.json({
            cart_id: cart._id,
            items: items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user_id: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id });
        }

        // Check if product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Check if item already in cart
        let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id });

        // Check stock availability
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
            cartItem = await CartItem.create({
                cart_id: cart._id,
                product_id,
                quantity: requestedQuantity
            });
        }

        res.status(201).json(cartItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;

    try {
        const cartItem = await CartItem.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Ensure user owns this cart item
        const cart = await Cart.findById(cartItem.cart_id);
        if (cart.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Không có quyền thực hiện' });
        }

        // Check stock availability before update
        const product = await Product.findById(cartItem.product_id);
        if (product.stock < quantity) {
            return res.status(400).json({ 
                message: `Không thể cập nhật. Chỉ còn ${product.stock} sản phẩm trong kho.` 
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json(cartItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Ensure user owns this cart item
        const cart = await Cart.findById(cartItem.cart_id);
        if (cart.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Không có quyền thực hiện' });
        }

        await cartItem.deleteOne();

        res.json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });

        if (cart) {
            await CartItem.deleteMany({ cart_id: cart._id });
        }

        res.json({ message: 'Đã xoá toàn bộ giỏ hàng' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
