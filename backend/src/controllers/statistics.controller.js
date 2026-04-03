const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const OrderItem = require('../models/orderItem.model');

// @desc    Get dashboard summary stats
// @route   GET /api/statistics/summary
// @access  Private/Admin
const getSummary = async (req, res) => {
    try {
        // Total Revenue (from delivered or paid orders)
        const orders = await Order.find({ 
            $or: [{ status: 'delivered' }, { payment_status: 'paid' }] 
        });
        const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);

        // Total Orders
        const totalOrders = await Order.countDocuments();

        // Low Stock Products (threshold < 10)
        const lowStockCount = await Product.countDocuments({ stock: { $lt: 10 } });

        // Total Customers (excluding admins)
        const totalCustomers = await User.countDocuments({ role_id: { $ne: null } }); // Assuming roles are set

        res.json({
            totalRevenue,
            totalOrders,
            lowStockCount,
            totalCustomers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get revenue statistics over last 30 days
// @route   GET /api/statistics/revenue-chart
const getRevenueChart = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await Order.find({
            created_at: { $gte: thirtyDaysAgo },
            status: { $ne: 'cancelled' }
        }).sort({ created_at: 1 });

        // Group by day
        const chartData = {};
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            chartData[dateStr] = 0;
        }

        orders.forEach(order => {
            const dateStr = new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            if (chartData[dateStr] !== undefined) {
                chartData[dateStr] += order.total_price;
            }
        });

        const formattedData = Object.keys(chartData).reverse().map(key => ({
            name: key,
            revenue: chartData[key]
        }));

        res.json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get product distribution by category
// @route   GET /api/statistics/category-distribution
const getCategoryDistribution = async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category_id',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    name: '$category.name',
                    value: '$count'
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get recent transactions
// @route   GET /api/statistics/recent-transactions
const getRecentTransactions = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user_id', 'name email avatar')
            .sort({ created_at: -1 })
            .limit(5);

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSummary,
    getRevenueChart,
    getCategoryDistribution,
    getRecentTransactions
};
