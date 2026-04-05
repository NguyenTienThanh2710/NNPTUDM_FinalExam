const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Product = require('./src/models/product.model');
const Brand = require('./src/models/brand.model');
const Category = require('./src/models/category.model');
const User = require('./src/models/user.model');
const Role = require('./src/models/role.model');
const Order = require('./src/models/order.model');
const OrderItem = require('./src/models/orderItem.model');
const Review = require('./src/models/review.model');

dotenv.config();

const seedData = async (mongoUri = process.env.MONGO_URI) => {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/nnptudm_finalexam');
            console.log('Connected to MongoDB...');
        }

        // Clear existing data
        await Promise.all([
            Product.deleteMany({}),
            Category.deleteMany({}),
            Brand.deleteMany({}),
            User.deleteMany({}),
            Role.deleteMany({}),
            Order.deleteMany({}),
            OrderItem.deleteMany({}),
            Review.deleteMany({})
        ]);

        console.log('Cleared existing data.');

        // 1. Create Roles
        const adminRole = await Role.create({ name: 'ADMIN', description: 'Administrator' });
        const userRole = await Role.create({ name: 'USER', description: 'Customer' });
        console.log('Created Roles.');

        // 2. Create Users
        const hashedPassword = await bcrypt.hash('123456', 10);
        const adminUser = await User.create({
            name: 'Admin Thanh',
            email: 'admin@example.com',
            password: hashedPassword,
            role_id: adminRole._id,
            status: 'active'
        });
        const testUser = await User.create({
            name: 'Test Customer',
            email: 'user@example.com',
            password: hashedPassword,
            role_id: userRole._id,
            status: 'active'
        });
        console.log('Created Users (admin@example.com / user@example.com, pass: 123456).');

        // 3. Create Categories
        const categories = await Category.insertMany([
            { name: 'Điện thoại', description: 'Smartphones & Mobile Devices' },
            { name: 'Laptop', description: 'Computers & Portables' },
            { name: 'Đồ gia dụng', description: 'Home Appliances' },
            { name: 'Phụ kiện', description: 'Tech Accessories' },
            { name: 'Linh kiện', description: 'Computer Parts' }
        ]);
        console.log('Created Categories.');

        // 4. Create Brands
        const brands = await Brand.insertMany([
            { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
            { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
            { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
            { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/82/Dell_Logo.svg' },
            { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
            { name: 'Logitech', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg' }
        ]);
        console.log('Created Brands.');

        // 5. Create Products
        const productsData = [
            // Phones
            {
                name: 'iPhone 15 Pro Max 256GB',
                price: 34990000,
                stock: 20,
                description: 'Flagship mới nhất từ Apple với khung titan và chip A17 Pro siêu mạnh mẽ.',
                category_id: categories[0]._id,
                brand_id: brands[0]._id,
                images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000'],
                avg_rating: 4.8,
                num_reviews: 120
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                price: 31990000,
                stock: 15,
                description: 'S-Pen tích hợp, camera 200MP và tính năng AI thông minh vượt trội.',
                category_id: categories[0]._id,
                brand_id: brands[1]._id,
                images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000'],
                avg_rating: 4.5,
                num_reviews: 85
            },
            // Laptops
            {
                name: 'MacBook Air M3 13-inch',
                price: 27990000,
                stock: 12,
                description: 'Mỏng nhẹ, mạnh mẽ với chip M3, pin dùng cả ngày dài.',
                category_id: categories[1]._id,
                brand_id: brands[0]._id,
                images: ['https://images.unsplash.com/photo-1517336714460-d13f82285a7b?q=80&w=1000'],
                avg_rating: 4.9,
                num_reviews: 45
            },
            {
                name: 'Dell XPS 13 Plus',
                price: 45000000,
                stock: 8,
                description: 'Thiết kế tương lai, màn hình OLED rực rỡ, hiệu năng đỉnh cao.',
                category_id: categories[1]._id,
                brand_id: brands[3]._id,
                images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000'],
                avg_rating: 4.2,
                num_reviews: 30
            },
            // Accessories
            {
                name: 'Sony WH-1000XM5',
                price: 8490000,
                stock: 25,
                description: 'Tai nghe chống ồn tốt nhất thế giới, chất âm chi tiết.',
                category_id: categories[3]._id,
                brand_id: brands[2]._id,
                images: ['https://images.unsplash.com/photo-1618366712242-7389ea1c4021?q=80&w=1000'],
                avg_rating: 4.7,
                num_reviews: 210
            },
            {
                name: 'Logitech MX Master 3S',
                price: 2490000,
                stock: 50,
                description: 'Chuột hiệu năng cao cho designer và coder, cảm biến 8K DPI.',
                category_id: categories[3]._id,
                brand_id: brands[5]._id,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000'],
                avg_rating: 4.4,
                num_reviews: 340
            },
            // TV / Home Appliances
            {
                name: 'Samsung 65-inch QLED 4K',
                price: 19990000,
                stock: 5,
                description: 'Hình ảnh sắc nét, màu sắc rực rỡ, Smart TV tích hợp đầy đủ ứng dụng.',
                category_id: categories[2]._id,
                brand_id: brands[1]._id,
                images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000'],
                avg_rating: 4.6,
                num_reviews: 60
            }
        ];

        const createdProducts = await Product.insertMany(productsData);
        console.log('Created Products.');

        // 6. Create Orders & Reviews
        // Sample Delivered Order for Today
        const today = new Date();
        const order1 = await Order.create({
            user_id: testUser._id,
            total_price: productsData[0].price,
            shipping_address: '123 Đường ABC, Quận 1, TP. HCM',
            phone_number: '0901234567',
            payment_method: 'BANK_TRANSFER',
            payment_status: 'paid',
            status: 'delivered',
            created_at: today
        });

        await OrderItem.create({
            order_id: order1._id,
            product_id: createdProducts[0]._id,
            quantity: 1,
            price: createdProducts[0].price
        });

        // Sample Pending Order
        const order2 = await Order.create({
            user_id: testUser._id,
            total_price: productsData[4].price + productsData[5].price,
            shipping_address: '456 Đường XYZ, Quận 7, TP. HCM',
            phone_number: '0988776655',
            payment_method: 'COD',
            payment_status: 'pending',
            status: 'pending',
            created_at: new Date(today - 86400000) // Yesterday
        });

        await OrderItem.insertMany([
            { order_id: order2._id, product_id: createdProducts[4]._id, quantity: 1, price: createdProducts[4].price },
            { order_id: order2._id, product_id: createdProducts[5]._id, quantity: 1, price: createdProducts[5].price }
        ]);

        console.log('Created Sample Orders.');

        // 7. Create Reviews
        await Review.create({
            product_id: createdProducts[0]._id,
            user_id: testUser._id,
            rating: 5,
            comment: 'Sản phẩm tuyệt vời, giao hàng nhanh!'
        });

        console.log('Successfully seeded database!');
        return true;
    } catch (err) {
        console.error('Error seeding data:', err);
        return false;
    }
};

// If called directly
if (require.main === module) {
    seedData()
        .then((success) => process.exit(success ? 0 : 1))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = seedData;
