const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
<<<<<<< HEAD
=======
const { MongoMemoryServer } = require('mongodb-memory-server');
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54

// Load env vars
dotenv.config();

// Route files
const auth = require('./src/routes/auth.route');
const brandRoutes = require('./src/routes/brand.route');
const categoryRoutes = require('./src/routes/category.route');
const productRoutes = require('./src/routes/product.route');
const cartRoutes = require('./src/routes/cart.route');
const orderRoutes = require('./src/routes/order.route');
<<<<<<< HEAD
const statisticsRoutes = require('./src/routes/statistics.route');
=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54

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
<<<<<<< HEAD
app.use('/api/statistics', statisticsRoutes);
=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
<<<<<<< HEAD
        await mongoose.connect(process.env.MONGO_URI);
=======
        let memoryServer = null;
        let mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            const dbName = process.env.MONGO_DB_NAME || 'nnptudm_finalexam';
            const port = Number(process.env.MONGO_PORT || 27017);

            memoryServer = await MongoMemoryServer.create({
                instance: { port, dbName }
            });

            mongoUri = `mongodb://127.0.0.1:${port}/${dbName}`;
        }

        await mongoose.connect(mongoUri);
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        console.log('MongoDB Connected...');

        app.listen(
            PORT, 
            console.log(`Server running on port ${PORT}`)
        );
<<<<<<< HEAD
=======

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
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

start();
