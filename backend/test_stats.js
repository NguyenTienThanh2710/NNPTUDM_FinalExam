const mongoose = require('mongoose');
const Order = require('./src/models/order.model');
const Product = require('./src/models/product.model');
const User = require('./src/models/user.model');
const Role = require('./src/models/role.model');

async function checkStats() {
    try {
        await mongoose.connect('mongodb://localhost:27017/nnptudm_finalexam');
        console.log('Connected to DB');

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startOfToday.setHours(0, 0, 0, 0);

        const totalOrders = await Order.countDocuments({});
        console.log('Total Orders:', totalOrders);

        const revenueTodayAgg = await Order.aggregate([
            { 
                $match: { 
                    created_at: { $gte: startOfToday }, 
                    status: { $ne: 'cancelled' } 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$total_price' }, 
                    count: { $sum: 1 } 
                } 
            }
        ]);
        console.log('Revenue Today Agg:', JSON.stringify(revenueTodayAgg, null, 2));

        const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });
        console.log('Low Stock Count (<=5):', lowStockCount);

        const activeCustomers = await User.countDocuments({ status: 'active' });
        console.log('Active Users (All roles):', activeCustomers);

        const userRole = await Role.findOne({ name: 'USER' });
        console.log('USER Role ID:', userRole ? userRole._id : 'Not found');
        if (userRole) {
            const activeUsersWithRole = await User.countDocuments({ status: 'active', role_id: userRole._id });
            console.log('Active Users with role USER:', activeUsersWithRole);
        }

        const allUsers = await User.find({}).populate('role_id');
        console.log('All Users:', allUsers.map(u => ({ name: u.name, status: u.status, role: u.role_id?.name })));

        const allOrders = await Order.find({});
        console.log('All Orders created_at values:', allOrders.map(o => ({ id: o._id.toString().slice(-4), created_at: o.created_at, total: o.total_price, status: o.status })));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkStats();
