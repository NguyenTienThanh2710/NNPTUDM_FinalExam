const express = require('express');
const router = express.Router();
const Order = require('../schemas/orders');
const OrderItem = require('../schemas/orderItems');
const Cart = require('../schemas/carts');
const CartItem = require('../schemas/cartItems');
const Product = require('../schemas/products');
const User = require('../schemas/users');
const Role = require('../schemas/roles');
const Brand = require('../schemas/brands');
const OrderStatusHistory = require('../schemas/orderStatusHistories');
const Category = require('../schemas/categories');
const { protect, admin } = require('../utils/auth');

router.use(protect);

router.route('/').post(async (req, res) => {
    try {
        const { city, district, ward, street_address, phone_number, payment_method, item_ids } = req.body;

        const cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            return res.status(400).json({ message: 'Không tìm thấy giỏ hàng của người dùng' });
        }

        const query = { cart_id: cart._id };
        if (item_ids && Array.isArray(item_ids) && item_ids.length > 0) {
            query._id = { $in: item_ids };
        }

        const cartItems = await CartItem.find(query).populate('product_id');
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm nào được chọn để thanh toán' });
        }

        for (const item of cartItems) {
            if (!item.product_id) {
                return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
            }
            if (item.product_id.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm ${item.product_id.name} đã hết hàng hoặc không đủ tồn kho (Còn: ${item.product_id.stock})`
                });
            }
        }

        const totalPrice = cartItems.reduce((total, item) => total + (item.product_id.price * item.quantity), 0);

        if (!city || !district || !ward || !street_address) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin địa chỉ giao hàng' });
        }
        if (!phone_number) {
            return res.status(400).json({ message: 'Vui lòng cung cấp số điện thoại nhận hàng' });
        }

        const allowedPaymentMethods = ['COD', 'BANK_TRANSFER'];
        if (payment_method && !allowedPaymentMethods.includes(payment_method)) {
            return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
        }

        const order = new Order({
            user_id: req.user.id,
            total_price: totalPrice,
            city,
            district,
            ward,
            street_address,
            phone_number,
            payment_method: payment_method || 'COD',
            payment_status: 'pending',
            status: 'pending'
        });

        const createdOrder = await order.save();

        for (const item of cartItems) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product_id._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { returnDocument: 'after' }
            );

            if (!updatedProduct) {
                throw new Error(`Sản phẩm ${item.product_id.name} vừa hết hàng.`);
            }

            await OrderItem.create({
                order_id: createdOrder._id,
                product_id: item.product_id._id,
                quantity: item.quantity,
                price: item.product_id.price
            });
        }

        await CartItem.deleteMany({ _id: { $in: cartItems.map((i) => i._id) } });

        await OrderStatusHistory.create({
            order_id: createdOrder._id,
            changed_by: req.user?._id || req.user?.id,
            status_type: 'order',
            old_value: 'none',
            new_value: 'pending',
            note: 'Đơn hàng được khởi tạo qua thanh toán từng phần'
        });

        res.status(201).json(createdOrder);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).get(async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 }).lean();
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const firstItem = await OrderItem.findOne({ order_id: order._id }).populate('product_id', 'name images').lean();
            return { ...order, main_item: firstItem };
        }));
        res.json(ordersWithItems);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/all').get(admin, async (_req, res) => {
    try {
        const orders = await Order.find({}).populate('user_id', 'name email').sort({ created_at: -1 }).lean();
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const firstItem = await OrderItem.findOne({ order_id: order._id }).populate('product_id', 'name images').lean();
            return { ...order, main_item: firstItem };
        }));
        res.json(ordersWithItems);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/dashboard').get(admin, async (_req, res) => {
    try {
        const now = new Date();
        const VN_OFFSET = 7 * 60 * 60 * 1000;
        const nowVN = new Date(Date.now() + VN_OFFSET);
        const startOfTodayVN = new Date(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate());
        startOfTodayVN.setUTCHours(0, 0, 0, 0);
        const startOfTodayUTC = new Date(startOfTodayVN.getTime() - VN_OFFSET);

        const revenueTodayAgg = await Order.aggregate([
            { $match: { created_at: { $gte: startOfTodayUTC }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total_price' }, count: { $sum: 1 } } }
        ]);

        const revenueToday = revenueTodayAgg[0]?.total || 0;
        const ordersToday = revenueTodayAgg[0]?.count || 0;
        const totalOrders = await Order.countDocuments({});

        const lowStockThreshold = 10;
        const lowStockCount = await Product.countDocuments({ stock: { $lte: lowStockThreshold } });

        const userRole = await Role.findOne({ name: 'USER' }).select('_id');
        const activeCustomers = userRole
            ? await User.countDocuments({ status: 'active', role_id: userRole._id })
            : await User.countDocuments({ status: 'active' });

        const recentActiveUsers = userRole
            ? await User.find({ status: 'active', role_id: userRole._id }).sort({ createdAt: -1 }).limit(4).select('name avatar')
            : await User.find({ status: 'active' }).sort({ createdAt: -1 }).limit(4).select('name avatar');

        const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const monthlyRevenueAgg = await Order.aggregate([
            { $match: { created_at: { $gte: startMonth }, status: { $ne: 'cancelled' } } },
            { $group: { _id: { y: { $year: '$created_at' }, m: { $month: '$created_at' } }, total: { $sum: '$total_price' } } },
            { $sort: { '_id.y': 1, '_id.m': 1 } }
        ]);

        const monthlyRevenueMap = new Map(
            monthlyRevenueAgg.map((r) => [`${r._id.y}-${String(r._id.m).padStart(2, '0')}`, r.total])
        );

        const monthlyRevenue = Array.from({ length: 6 }, (_v, idx) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + idx, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return { year: d.getFullYear(), month: d.getMonth() + 1, total: monthlyRevenueMap.get(key) || 0 };
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

        const unclassifiedProductCount = await Product.countDocuments({ category_id: { $exists: false } });
        const visibleProductCount = await Product.countDocuments({ is_visible: true });
        const categoryCount = await Category.countDocuments({});

        res.json({
            revenueToday,
            ordersToday,
            totalOrders,
            lowStockCount,
            lowStockThreshold,
            activeCustomers,
            recentActiveUsers,
            monthlyRevenue,
            productDistribution,
            totalProducts,
            unclassifiedProductCount,
            visibleProductCount,
            categoryCount
        });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user_id', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const isAdminUser = req.userRole === 'ADMIN' || req.user?.role_id?.name === 'ADMIN';
        const orderUserId = typeof order.user_id === 'string' ? order.user_id : order.user_id?._id;
        if (String(orderUserId) !== req.user.id && !isAdminUser) {
            return res.status(401).json({ message: 'Không có quyền truy cập' });
        }

        const items = await OrderItem.find({ order_id: order._id }).populate('product_id', 'name price images');
        const history = await OrderStatusHistory.find({ order_id: order._id }).populate('changed_by', 'name').sort({ created_at: -1 });

        res.json({ order, items, history });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id/cancel').put(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const orderUserId = order.user_id?._id || order.user_id;
        if (String(orderUserId) !== req.user.id) {
            return res.status(401).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý' });
        }

        const orderItems = await OrderItem.find({ order_id: order._id });
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: item.quantity } });
        }

        const oldStatus = order.status;
        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            { $set: { status: 'cancelled' } },
            { returnDocument: 'after' }
        );

        await OrderStatusHistory.create({
            order_id: order._id,
            changed_by: req.user?._id || req.user?.id,
            status_type: 'order',
            old_value: oldStatus,
            new_value: 'cancelled',
            note: 'Đơn hàng được người dùng hủy'
        });

        res.json(updatedOrder);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id/status').put(admin, async (req, res) => {
    const { status, note } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
        }

        const transitions = {
            pending: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered', 'cancelled'],
            delivered: [],
            cancelled: []
        };

        const currentStatus = order.status || 'pending';
        if (!transitions[currentStatus] || !transitions[currentStatus].includes(status)) {
            return res.status(400).json({ message: `Không thể chuyển trạng thái từ ${currentStatus} sang ${status}` });
        }

        const oldStatus = order.status;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { returnDocument: 'after', runValidators: false }
        );

        await OrderStatusHistory.create({
            order_id: order._id,
            changed_by: req.user?._id || req.user?.id,
            status_type: 'order',
            old_value: oldStatus,
            new_value: status,
            note: note || `Cập nhật trạng thái đơn hàng sang ${status}`
        });

        res.json(updatedOrder);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id/payment').put(admin, async (req, res) => {
    const { payment_status, note } = req.body;
    try {
        const allowedStatuses = ['pending', 'paid', 'failed'];
        if (!allowedStatuses.includes(payment_status)) {
            return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const oldPaymentStatus = order.payment_status;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { payment_status } },
            { returnDocument: 'after', runValidators: false }
        );

        await OrderStatusHistory.create({
            order_id: order._id,
            changed_by: req.user?._id || req.user?.id,
            status_type: 'payment',
            old_value: oldPaymentStatus,
            new_value: payment_status,
            note: note || `Cập nhật trạng thái thanh toán sang ${payment_status}`
        });

        res.json(updatedOrder);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
