const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load env vars
dotenv.config({ quiet: true });

// Route files
const auth = require('./src/routes/auth.route');
const brandRoutes = require('./src/routes/brand.route');
const categoryRoutes = require('./src/routes/category.route');
const productRoutes = require('./src/routes/product.route');
const cartRoutes = require('./src/routes/cart.route');
const orderRoutes = require('./src/routes/order.route');
const wishlistRoutes = require('./src/routes/wishlist.route');
const adminRoutes = require('./src/routes/admin.route');
const reviewRoutes = require('./src/routes/review.route');

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
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        let memoryServer = null;
        let mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            const dbName = process.env.MONGO_DB_NAME || 'nnptudm_finalexam';
            let port = Number(process.env.MONGO_PORT || 27017);

            try {
                memoryServer = await MongoMemoryServer.create({
                    instance: { port, dbName }
                });
            } catch (error) {
                console.log(`Failed to start on port ${port}, trying a random port...`);
                // If it fails on the specific port, try letting it pick a random one
                memoryServer = await MongoMemoryServer.create({
                    instance: { dbName }
                });
            }

            mongoUri = memoryServer.getUri();
            console.log(`Memory MongoDB started at: ${mongoUri}`);
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected...');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        const shutdown = async () => {
            try {
                await mongoose.disconnect();
                if (memoryServer) {
                    await memoryServer.stop();
                }
            } finally {
                process.exit(0);
            }
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

start();
