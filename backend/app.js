const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Route files
const auth = require('./src/routes/auth.route');
const brandRoutes = require('./src/routes/brand.route');
const categoryRoutes = require('./src/routes/category.route');
const productRoutes = require('./src/routes/product.route');
const cartRoutes = require('./src/routes/cart.route');
const orderRoutes = require('./src/routes/order.route');

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        app.listen(
            PORT, 
            console.log(`Server running on port ${PORT}`)
        );
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

start();
