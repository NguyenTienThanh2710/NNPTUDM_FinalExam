const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Role = require('./schemas/roles');
const Brand = require('./schemas/brands');
const Category = require('./schemas/categories');
const Product = require('./schemas/products');
const User = require('./schemas/users');
const Cart = require('./schemas/carts');
const CartItem = require('./schemas/cartItems');
const Order = require('./schemas/orders');
const OrderItem = require('./schemas/orderItems');

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shop-database';
        console.log(`Connecting to MongoDB: ${mongoUri}`);
        await mongoose.connect(mongoUri);

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
        const passwordHash = await bcrypt.hash('password123', 10);
        const users = await User.insertMany([
            {
                name: 'System Admin',
                email: 'admin@example.com',
                password: passwordHash,
                role_id: adminRoleId,
                avatar: 'https://i.pravatar.cc/150?img=11',
                address: 'Admin Building, Hanoi',
                status: 'active'
            },
            {
                name: 'Nguyễn Văn Khách',
                email: 'user@example.com',
                password: passwordHash,
                role_id: userRoleId,
                avatar: 'https://i.pravatar.cc/150?img=12',
                address: '123 Hoang Hoa Tham, Ba Dinh, Hanoi',
                status: 'active'
            },
            {
                name: 'Lê Thị Mua Sắm',
                email: 'user2@example.com',
                password: passwordHash,
                role_id: userRoleId,
                avatar: 'https://i.pravatar.cc/150?img=5',
                address: '456 Nguyen Trai, Thanh Xuan, Hanoi',
                status: 'active'
            },
            {
                name: 'Trần Đại Gia',
                email: 'vipuser@example.com',
                password: passwordHash,
                role_id: userRoleId,
                avatar: 'https://i.pravatar.cc/150?img=60',
                address: '789 Le Duan, District 1, HCMC',
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
            // --- APPLE ---
            {
                name: 'iPhone 15 Pro Max 256GB - Blue Titanium', price: 34990000, stock: 45, brand_id: brands[0]._id, category_id: categories[0]._id,
                description: 'Khung titan bền bỉ, chip A17 Pro siêu mạnh, camera zoom quang 5x chuyên nghiệp.',
                images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'iPhone 15 Plus 128GB - Pink', price: 25990000, stock: 20, brand_id: brands[0]._id, category_id: categories[0]._id,
                description: 'Màn hình Dynamic Island, pin trâu nhất lịch sử iPhone, màu sắc trẻ trung.',
                images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'iPhone 13 128GB - Midnight', price: 15490000, stock: 35, brand_id: brands[0]._id, category_id: categories[0]._id,
                description: 'Thiết kế cổ điển, hiệu năng vẫn cực kỳ ổn định trong tầm giá.',
                images: ['https://images.unsplash.com/photo-1633113089631-6456cccaadad?auto=format&fit=crop&q=80&w=1000']
            },

            // --- SAMSUNG ---
            {
                name: 'Samsung Galaxy S24 Ultra 512GB', price: 32990000, stock: 32, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Quyền năng Galaxy AI, màn hình phẳng 2600 nits, bút S-Pen thông minh.',
                images: ['https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'Samsung Galaxy Z Fold5 256GB', price: 39990000, stock: 12, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Màn hình gập không kẽ hở, đa nhiệm đỉnh cao, rạp chiếu phim bỏ túi.',
                images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'Samsung Galaxy Z Flip5 512GB', price: 21990000, stock: 18, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Màn hình ngoài Flex Window cực lớn, thiết kế thời trang, gập mở linh hoạt.',
                images: ['https://images.unsplash.com/photo-1689129524021-3e4093f185f3?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'Samsung Galaxy S23 FE 128GB', price: 12990000, stock: 25, brand_id: brands[1]._id, category_id: categories[0]._id,
                description: 'Hiệu năng flagship với mức giá dễ tiếp cận, camera chụp đêm ấn tượng.',
                images: ['https://images.unsplash.com/photo-1681283737502-0e9e19d71c82?auto=format&fit=crop&q=80&w=1000']
            },

            // --- XIAOMI ---
            {
                name: 'Xiaomi 14 Pro Leica', price: 22990000, stock: 15, brand_id: brands[2]._id, category_id: categories[0]._id,
                description: 'Hệ thống ống kính Leica Optic cao cấp, sạc siêu nhanh 120W.',
                images: ['https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'Xiaomi Redmi Note 13 Pro+ 5G', price: 10490000, stock: 50, brand_id: brands[2]._id, category_id: categories[0]._id,
                description: 'Màn hình cong 1.5K, camera 200MP, thiết kế tinh tế đẳng cấp.',
                images: ['https://images.unsplash.com/photo-1614605282121-729069d67ba5?auto=format&fit=crop&q=80&w=1000']
            },

            // --- OPPO ---
            {
                name: 'Oppo Find N3 Flip', price: 22990000, stock: 10, brand_id: brands[3]._id, category_id: categories[0]._id,
                description: 'Bậc thầy về camera chân dung trên điện thoại gập, thiết kế sang trọng.',
                images: ['https://images.unsplash.com/photo-1541140532154-b024fd304564?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'Oppo Reno11 Pro 5G', price: 15990000, stock: 22, brand_id: brands[3]._id, category_id: categories[0]._id,
                description: 'Chuyên gia chân dung, thiết kế lấy cảm hứng từ đá quý.',
                images: ['https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?auto=format&fit=crop&q=80&w=1000']
            },

            // --- LAPTOPS & OTHERS ---
            {
                name: 'MacBook Pro 14 M3 Chip', price: 39990000, stock: 15, brand_id: brands[0]._id, category_id: categories[1]._id,
                description: 'Hiệu năng đồ họa đỉnh cao, thời lượng pin lên đến 22 giờ.',
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'iPad Pro 12.9 M2 256GB', price: 29990000, stock: 12, brand_id: brands[0]._id, category_id: categories[2]._id,
                description: 'Màn hình Liquid Retina XDR siêu thực, sức mạnh máy tính trong thân hình tablet.',
                images: ['https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?auto=format&fit=crop&q=80&w=1000']
            },
            {
                name: 'Sony WH-1000XM5 Noise Cancelling', price: 8490000, stock: 30, brand_id: brands[4]._id, category_id: categories[4]._id,
                description: 'Công nghệ chống ồn hàng đầu thế giới, âm thanh Hi-Res chân thực.',
                images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000']
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
            shipping_address: '123 Main St, Hanoi, Vietnam',
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
            shipping_address: '456 Nguyen Hue, HCMC, Vietnam',
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
