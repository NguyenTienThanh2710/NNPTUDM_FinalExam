const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');

<<<<<<< HEAD
// @desc    Create new order from cart
=======
// @desc    Create new order
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
<<<<<<< HEAD
        const { payment_method = 'cod', shipping_address = '', recipient_name = '', recipient_email = '', recipient_phone = '' } = req.body;

=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        const cart = await Cart.findOne({ user_id: req.user.id });

        if (!cart) {
            return res.status(400).json({ message: 'No cart found for this user' });
        }

        const cartItems = await CartItem.find({ cart_id: cart._id }).populate('product_id');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total price
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.product_id.price * item.quantity);
        }, 0);

        // Create the order
        const order = new Order({
            user_id: req.user.id,
            total_price: totalPrice,
<<<<<<< HEAD
            status: 'pending',
            payment_method,
            payment_status: 'pending',
            shipping_address,
            recipient_name,
            recipient_email,
            recipient_phone
=======
            status: 'pending'
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        });

        const createdOrder = await order.save();

        // Create order items
        const orderItemsPromises = cartItems.map(item => {
            return OrderItem.create({
                order_id: createdOrder._id,
                product_id: item.product_id._id,
                quantity: item.quantity,
                price: item.product_id.price
            });
        });

        await Promise.all(orderItemsPromises);

        // Clear cart after order creation
        await CartItem.deleteMany({ cart_id: cart._id });

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user_id', 'name email').sort({ created_at: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user owns this order OR is admin
<<<<<<< HEAD
        if (order.user_id.toString() !== req.user.id && req.user.role_id?.name !== 'ADMIN') {
=======
        if (order.user_id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            return res.status(401).json({ message: 'Not authorized' });
        }

        const items = await OrderItem.find({ order_id: order._id }).populate('product_id', 'name price images');

        res.json({
            order: order,
            items: items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

<<<<<<< HEAD
// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
    const { payment_status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.payment_status = payment_status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
=======
module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
};
