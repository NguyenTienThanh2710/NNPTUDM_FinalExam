const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const Brand = require('../models/brand.model');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });

        if (!cart) {
            return res.status(400).json({ message: 'Không tìm thấy giỏ hàng của người dùng' });
        }

        const cartItems = await CartItem.find({ cart_id: cart._id }).populate('product_id');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng đang trống' });
        }

        // Calculate total price
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.product_id.price * item.quantity);
        }, 0);

        // Create the order
        const order = new Order({
            user_id: req.user.id,
            total_price: totalPrice,
            status: 'pending'
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
        res.status(500).json({ message: 'Lỗi máy chủ' });
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
        res.status(500).json({ message: 'Lỗi máy chủ' });
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
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Ensure user owns this order OR is admin
        if (order.user_id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Không có quyền truy cập' });
        }

        const items = await OrderItem.find({ order_id: order._id }).populate('product_id', 'name price images');

        res.json({
            order: order,
            items: items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
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
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Admin dashboard stats
// @route   GET /api/orders/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        const revenueTodayAgg = await Order.aggregate([
            { $match: { created_at: { $gte: startOfToday, $lte: endOfToday }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total_price' }, count: { $sum: 1 } } }
        ]);

        const revenueToday = revenueTodayAgg[0]?.total || 0;
        const ordersToday = revenueTodayAgg[0]?.count || 0;

        const totalOrders = await Order.countDocuments({});

        const lowStockThreshold = 5;
        const lowStockCount = await Product.countDocuments({ stock: { $lte: lowStockThreshold } });

        const userRole = await Role.findOne({ name: 'USER' }).select('_id');
        const activeCustomers = userRole
            ? await User.countDocuments({ status: 'active', role_id: userRole._id })
            : await User.countDocuments({ status: 'active' });

        const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const monthlyRevenueAgg = await Order.aggregate([
            { $match: { created_at: { $gte: startMonth }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { y: { $year: '$created_at' }, m: { $month: '$created_at' } },
                    total: { $sum: '$total_price' }
                }
            },
            { $sort: { '_id.y': 1, '_id.m': 1 } }
        ]);

        const monthlyRevenueMap = new Map(
            monthlyRevenueAgg.map((r) => [`${r._id.y}-${String(r._id.m).padStart(2, '0')}`, r.total])
        );

        const monthlyRevenue = Array.from({ length: 6 }, (_, idx) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + idx, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                total: monthlyRevenueMap.get(key) || 0
            };
        });

        const totalProducts = await Product.countDocuments({});
        const distributionAgg = await Product.aggregate([
            { $group: { _id: '$brand_id', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

        const brandIds = distributionAgg.map((d) => d._id).filter(Boolean);
        const brands = await Brand.find({ _id: { $in: brandIds } }).select('name');
        const brandNameById = new Map(brands.map((b) => [String(b._id), b.name]));

        const productDistribution = distributionAgg.map((d) => {
            const name = brandNameById.get(String(d._id)) || 'Khác';
            const percent = totalProducts > 0 ? Math.round((d.count / totalProducts) * 100) : 0;
            return { name, count: d.count, percent };
        });

        res.json({
            revenueToday,
            ordersToday,
            totalOrders,
            lowStockCount,
            lowStockThreshold,
            activeCustomers,
            monthlyRevenue,
            productDistribution
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    getDashboardStats
};
