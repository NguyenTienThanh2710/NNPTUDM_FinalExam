const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./src/models/order.model');
const OrderItem = require('./src/models/orderItem.model');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');

dotenv.config();

const seedTodayOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'user@example.com' });
        const product = await Product.findOne({});
        
        if (!user || !product) {
            console.log('User or Product not found');
            process.exit(0);
        }

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startOfToday.setHours(12, 0, 0, 0); // Middle of today

        const order = new Order({
            user_id: user._id,
            total_price: 15000000,
            shipping_address: '123 Test St, Today',
            phone_number: '0987654321',
            payment_method: 'COD',
            payment_status: 'paid',
            status: 'delivered',
            created_at: now // Today
        });

        const createdOrder = await order.save();
        console.log('Created order for TODAY:', createdOrder._id);

        await OrderItem.create({
            order_id: createdOrder._id,
            product_id: product._id,
            quantity: 1,
            price: 15000000
        });

        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTodayOrder();
