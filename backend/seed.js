const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Role = require('./src/models/role.model');
const Brand = require('./src/models/brand.model');
const Category = require('./src/models/category.model');
const Product = require('./src/models/product.model');
const User = require('./src/models/user.model');
const Cart = require('./src/models/cart.model');
const CartItem = require('./src/models/cartItem.model');
const Order = require('./src/models/order.model');
const OrderItem = require('./src/models/orderItem.model');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Promise.all([
            Role.deleteMany({}),
            Brand.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            User.deleteMany({}),
            Cart.deleteMany({}),
            CartItem.deleteMany({}),
            Order.deleteMany({}),
            OrderItem.deleteMany({})
        ]);

        console.log('Seeding Roles...');
        const roles = await Role.insertMany([
            { name: 'ADMIN', description: 'Quản trị viên hệ thống' },
            { name: 'USER', description: 'Khách hàng mặc định' }
        ]);
        const adminRoleId = roles[0]._id;
        const userRoleId = roles[1]._id;

        console.log('Seeding Users...');
        const passwordHash = await bcrypt.hash('123456', 10);
        const users = await User.insertMany([
            {
                name: 'System Admin',
                email: 'admin@example.com',
                password: passwordHash,
                role_id: adminRoleId,
                avatar: 'https://i.pravatar.cc/150?img=11',
                status: 'active'
            },
            {
                name: 'Nguyễn Văn Khách',
                email: 'user@example.com',
                password: passwordHash,
                role_id: userRoleId,
                avatar: 'https://i.pravatar.cc/150?img=12',
                status: 'active'
            },
            {
                name: 'Lê Thị Mua Sắm',
                email: 'user2@example.com',
                password: passwordHash,
                role_id: userRoleId,
                avatar: 'https://i.pravatar.cc/150?img=5',
                status: 'active'
            },
            {
                name: 'Trần Đại Gia',
                email: 'vipuser@example.com',
                password: passwordHash,
                role_id: userRoleId,
                avatar: 'https://i.pravatar.cc/150?img=60',
                status: 'active'
            }
        ]);

        console.log('Seeding Brands...');
        const brands = await Brand.insertMany([
            { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
            { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
            { name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
            { name: 'Oppo', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/OPPO_LOGO_2019.svg' },
            { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
            { name: 'Asus', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg' }
        ]);

        console.log('Seeding Categories...');
        const categories = await Category.insertMany([
            { name: 'Điện thoại thông minh', description: 'Smartphone iOS và Android tốt nhất' },
            { name: 'Laptop / PC', description: 'Máy tính đồ họa, văn phòng, gaming' },
            { name: 'Máy tính bảng', description: 'iPad, Galaxy Tab siêu mỏng nhẹ' },
            { name: 'Đồng hồ thông minh', description: 'Phụ kiện theo dõi sức khỏe kết nối đa năng' },
            { name: 'Âm thanh', description: 'Tai nghe Over-ear, In-ear, loa bluetooth' }
        ]);

        console.log('Seeding Products...');
        const products = await Product.insertMany([
            // Apple Phones
            {
                name: 'iPhone 15 Pro Max 256GB', price: 34990000, stock: 45, brand_id: brands[0]._id, category_id: categories[0]._id,
                description: 'Titanium framework, chip A17 Pro, camera xoá phông quang học 5x.',
                images: ['https://picsum.photos/seed/nnptudm-iphone15-promax/900/900']
            },
            {
                name: 'iPhone 14, 128GB, Blue', price: 18990000, stock: 20, brand_id: brands[0]._id, category_id: categories[0]._id,
                description: 'Smartphone quốc dân nhỏ gọn với sức mạnh ấn tượng.',
                images: ['https://picsum.photos/seed/nnptudm-iphone14-blue/900/900']
            },
            // Samsung Phones
            {
                name: 'Samsung Galaxy S24 Ultra 512GB', price: 32990000, stock: 32, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Tích hợp AI quyền năng, thân titan và bút SPen tiện dụng.',
                images: ['https://picsum.photos/seed/nnptudm-s24-ultra/900/900']
            },
            {
                name: 'Samsung Galaxy Z Fold5', price: 39990000, stock: 12, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Màn hình gập thế hệ mới, đa nhiệm hoàn hảo như một PC bỏ túi.',
                images: ['https://picsum.photos/seed/nnptudm-zfold5/900/900']
            },
            {
                name: 'Galaxy A54 5G', price: 9500000, stock: 0, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Pin khỏe, camera OIS chống rung, màu sắc trẻ trung.',
                images: ['https://picsum.photos/seed/nnptudm-a54-5g/900/900']
            },
            // Xiaomi
            {
                name: 'Xiaomi 14 Pro', price: 22990000, stock: 25, brand_id: brands[2]._id, category_id: categories[0]._id,
                description: 'Camera hợp tác Leica, Snapdragon 8 Gen 3 siêu mạnh.',
                images: ['https://picsum.photos/seed/nnptudm-xiaomi14pro/900/900']
            },
            // Laptops
            {
                name: 'MacBook Pro 14 M3 Pro', price: 49990000, stock: 15, brand_id: brands[0]._id, category_id: categories[1]._id,
                description: 'Sức mạnh quái vật từ chip M3 Pro dành cho editor, coder.',
                images: ['https://picsum.photos/seed/nnptudm-macbook-pro-14/900/900']
            },
            {
                name: 'Asus ROG Zephyrus G14', price: 35990000, stock: 8, brand_id: brands[5]._id, category_id: categories[1]._id,
                description: 'Laptop gaming nhỏ gọn 14 inch mạnh mẽ nhất thế giới.',
                images: ['https://picsum.photos/seed/nnptudm-rog-g14/900/900']
            },
            // Tablets
            {
                name: 'iPad Pro M2 11-inch', price: 23990000, stock: 20, brand_id: brands[0]._id, category_id: categories[2]._id,
                description: 'Tablet chuyên nghiệp hỗ trợ màn hình 120Hz ProMotion.',
                images: ['https://picsum.photos/seed/nnptudm-ipad-pro-m2/900/900']
            },
            {
                name: 'Samsung Galaxy Tab S9 Ultra', price: 28990000, stock: 10, brand_id: brands[1]._id, category_id: categories[2]._id,
                description: 'Màn hình khổng lồ 14.6 inch, chống nước IP68.',
                images: ['https://picsum.photos/seed/nnptudm-tab-s9-ultra/900/900']
            },
            // Watches
            {
                name: 'Apple Watch Ultra 2', price: 21990000, stock: 5, brand_id: brands[0]._id, category_id: categories[3]._id,
                description: 'Đồng hồ thể thao chuyên biệt, titan nguyên khối, định vị GPS kép.',
                images: ['https://picsum.photos/seed/nnptudm-watch-ultra2/900/900']
            },
            {
                name: 'Galaxy Watch 6 Classic', price: 8990000, stock: 14, brand_id: brands[1]._id, category_id: categories[3]._id,
                description: 'Viền xoay vật lý độc đáo, theo dõi huyết áp ECG.',
                images: ['https://picsum.photos/seed/nnptudm-watch6-classic/900/900']
            },
            // Audio
            {
                name: 'Sony WH-1000XM5', price: 7990000, stock: 40, brand_id: brands[4]._id, category_id: categories[4]._id,
                description: 'Chống ồn ANC dẫn đầu thị trường, dải âm tuyệt hảo.',
                images: ['https://picsum.photos/seed/nnptudm-sony-xm5/900/900']
            },
            {
                name: 'AirPods Pro Gen 2', price: 5490000, stock: 68, brand_id: brands[0]._id, category_id: categories[4]._id,
                description: 'Âm thanh vòm Spatial Audio, xuyên âm tự động.',
                images: ['https://picsum.photos/seed/nnptudm-airpods-pro2/900/900']
            }
        ]);

        console.log('Seeding Carts & Orders...');
        const userCart = await Cart.create({ user_id: users[1]._id });
        await CartItem.insertMany([
            { cart_id: userCart._id, product_id: products[0]._id, quantity: 1 }
        ]);

        // Create a few past orders for users
        const order1 = await Order.create({
            user_id: users[1]._id,
            total_price: products[0].price + (products[13].price * 2), // iPhone + 2 airpods
            status: 'delivered',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        });
        await OrderItem.insertMany([
            { order_id: order1._id, product_id: products[0]._id, quantity: 1, price: products[0].price },
            { order_id: order1._id, product_id: products[13]._id, quantity: 2, price: products[13].price }
        ]);

        const order2 = await Order.create({
            user_id: users[2]._id,
            total_price: products[6].price, // Macbook
            status: 'processing',
            created_at: new Date()
        });
        await OrderItem.insertMany([
            { order_id: order2._id, product_id: products[6]._id, quantity: 1, price: products[6].price }
        ]);

        console.log('Seed EXTENDED database created successfully!');
        console.log('--- TEST ACCOUNTS ---');
        console.log('Admin: admin@example.com / 123456');
        console.log('User : user@example.com / 123456');
        process.exitCode = 0;
    } catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedData();
