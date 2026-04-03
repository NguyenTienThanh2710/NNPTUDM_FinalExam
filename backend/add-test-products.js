const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/product.model');
const Brand = require('./src/models/brand.model');
const Category = require('./src/models/category.model');

dotenv.config();

const addProducts = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nnptudm_finalexam';
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB at ${mongoUri}...`);

        // Find or create a Brand
        let appleBrand = await Brand.findOne({ name: 'Apple' });
        if (!appleBrand) {
            appleBrand = await Brand.create({ name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' });
        }

        // Find or create a Category
        let phoneCat = await Category.findOne({ name: 'Điện thoại thông minh' });
        if (!phoneCat) {
            phoneCat = await Category.create({ name: 'Điện thoại thông minh', description: 'Smartphone tốt nhất' });
        }

        // Add Test Products
        const testProducts = [
            {
                name: 'iPhone 15 Pro Test',
                price: 29990000,
                stock: 10,
                description: 'Sản phẩm mẫu để test Wishlist',
                brand_id: appleBrand._id,
                category_id: phoneCat._id,
                images: ['https://picsum.photos/seed/test1/900/900']
            },
            {
                name: 'iPhone 14 Plus Test',
                price: 21990000,
                stock: 15,
                description: 'Sản phẩm mẫu để test Wishlist 2',
                brand_id: appleBrand._id,
                category_id: phoneCat._id,
                images: ['https://picsum.photos/seed/test2/900/900']
            },
            {
                name: 'MacBook Air M2 Test',
                price: 24990000,
                stock: 5,
                description: 'Sản phẩm mẫu để test Wishlist 3',
                brand_id: appleBrand._id,
                category_id: phoneCat._id,
                images: ['https://picsum.photos/seed/test3/900/900']
            }
        ];

        await Product.insertMany(testProducts);
        console.log('Added 3 test products successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('Error adding products:', err);
        process.exit(1);
    }
};

addProducts();
