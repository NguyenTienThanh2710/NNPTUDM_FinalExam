const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { protect, admin } = require('./src/middleware/auth.middleware');

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

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const originalExt = path.extname(file.originalname || '');
        const ext = originalExt.length <= 12 ? originalExt : '';
        cb(null, `${crypto.randomUUID()}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = new Set([
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml'
        ]);
        cb(null, allowed.has(file.mimetype));
    }
});

app.post('/api/upload', protect, admin, upload.any(), (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    if (!files.length) {
        res.status(400).json({ message: 'Vui lòng chọn ảnh để upload' });
        return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls = files.map((f) => `${baseUrl}/uploads/${f.filename}`);
    res.json({ url: urls[0], urls });
});

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
            const dbName = process.env.MONGO_DB_NAME || 'shop-database';
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
