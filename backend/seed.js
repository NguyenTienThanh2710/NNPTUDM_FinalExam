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
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
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
            { name: 'System Admin', email: 'admin@example.com', password: passwordHash, role_id: adminRoleId, avatar: 'https://i.pravatar.cc/150?img=11', status: 'active', phone: '0901234567', address: '123 Quận 1, TP.HCM' },
            { name: 'Nguyễn Văn Khách', email: 'user@example.com', password: passwordHash, role_id: userRoleId, avatar: 'https://i.pravatar.cc/150?img=12', status: 'active', phone: '0988777666', address: '456 Lê Lợi, Quận 1, TP.HCM' },
            { name: 'Lê Thị Mua Sắm', email: 'user2@example.com', password: passwordHash, role_id: userRoleId, avatar: 'https://i.pravatar.cc/150?img=5', status: 'active', phone: '0977111222', address: '789 Nguyễn Huệ, Quận 1, TP.HCM' },
            { name: 'Trần Đại Gia', email: 'vipuser@example.com', password: passwordHash, role_id: userRoleId, avatar: 'https://i.pravatar.cc/150?img=60', status: 'active', phone: '0966333444', address: '101 Đồng Khởi, Quận 1, TP.HCM' },
            { name: 'Hoàng Lan Anh', email: 'lananh@example.com', password: passwordHash, role_id: userRoleId, avatar: 'https://i.pravatar.cc/150?img=32', status: 'active', phone: '0955222111', address: '202 Pasteur, Quận 3, TP.HCM' }
        ]);

        console.log('Seeding Brands...');
        const brands = await Brand.insertMany([
            { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
            { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
            { name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
            { name: 'Oppo', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/OPPO_LOGO_2019.svg' },
            { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
            { name: 'Asus', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg' },
            { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }
        ]);

        console.log('Seeding Categories...');
        const categories = await Category.insertMany([
            { name: 'Điện thoại', description: 'Smartphone iOS và Android tốt nhất' },
            { name: 'Laptop', description: 'Máy tính đồ họa, văn phòng, gaming' },
            { name: 'Máy tính bảng', description: 'iPad, Galaxy Tab siêu mỏng nhẹ' },
            { name: 'Đồng hồ', description: 'Smartwatch theo dõi sức khỏe' },
            { name: 'Âm thanh', description: 'Tai nghe, loa bluetooth' }
        ]);

        console.log('Seeding Products...');
        const productsData = [
            // iPhones
            { name: 'iPhone 15 Pro Max 256GB', price: 34990000, stock: 45, brand_id: brands[0]._id, category_id: categories[0]._id, is_featured: true, description: 'Titanium framework, chip A17 Pro.', images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80'] },
            { name: 'iPhone 15 Blue 128GB', price: 19990000, stock: 30, brand_id: brands[0]._id, category_id: categories[0]._id, is_featured: true, description: 'Màu xanh pastel cực đẹp, camera 48MP.', images: ['https://images.unsplash.com/photo-1695048133142-1a20484f7b6f?auto=format&fit=crop&w=800&q=80'] },
            { name: 'iPhone 14 128GB', price: 16490000, stock: 15, brand_id: brands[0]._id, category_id: categories[0]._id, description: 'Chip A15 Bionic vẫn cực kỳ mạnh mẽ.', images: ['https://images.unsplash.com/photo-1663465373307-e81882ef9eb4?auto=format&fit=crop&w=800&q=80'] },
            
            // Samsung
            { name: 'Samsung Galaxy S24 Ultra', price: 31990000, stock: 25, brand_id: brands[1]._id, category_id: categories[0]._id, is_featured: true, description: 'Galaxy AI is here.', images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Samsung Galaxy Z Fold5', price: 36990000, stock: 10, brand_id: brands[1]._id, category_id: categories[0]._id, description: 'Trải nghiệm màn hình gập đỉnh cao.', images: ['https://images.unsplash.com/photo-1627993072235-9c9ae0bcaec2?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Galaxy A54 5G', price: 8990000, stock: 50, brand_id: brands[1]._id, category_id: categories[0]._id, description: 'Smartphone tầm trung hoàn hảo.', images: ['https://images.unsplash.com/photo-1600087626014-e652e18bbff2?auto=format&fit=crop&w=800&q=80'] },

            // Google
            { name: 'Pixel 8 Pro Mint Edition', price: 24990000, stock: 12, brand_id: brands[6]._id, category_id: categories[0]._id, is_featured: true, description: 'The power of Google AI.', images: ['https://images.unsplash.com/photo-1697526019557-4cc388274640?auto=format&fit=crop&w=800&q=80'] },

            // Laptops
            { name: 'MacBook Pro 14 M3', price: 44990000, stock: 10, brand_id: brands[0]._id, category_id: categories[1]._id, is_featured: true, description: 'Chip M3 mới nhất.', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'] },
            { name: 'MacBook Air M2', price: 24990000, stock: 20, brand_id: brands[0]._id, category_id: categories[1]._id, description: 'Mỏng nhẹ, pin trâu.', images: ['https://images.unsplash.com/photo-1611186871348-b1ec696e520b?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Asus ROG Zephyrus G14', price: 38990000, stock: 8, brand_id: brands[5]._id, category_id: categories[1]._id, description: 'Laptop gaming nhỏ gọn mạnh mẽ.', images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80'] },

            // Tablets
            { name: 'iPad Pro M2 11-inch', price: 21990000, stock: 18, brand_id: brands[0]._id, category_id: categories[2]._id, is_featured: true, description: 'Tablet mạnh nhất thế giới.', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'] },
            { name: 'iPad Air 5', price: 14490000, stock: 25, brand_id: brands[0]._id, category_id: categories[2]._id, description: 'Chip M1 mạnh mẽ, nhiều màu sắc.', images: ['https://images.unsplash.com/photo-1589739900243-4b123b73059d?auto=format&fit=crop&w=800&q=80'] },

            // Watches
            { name: 'Apple Watch Series 9', price: 9990000, stock: 40, brand_id: brands[0]._id, category_id: categories[3]._id, is_featured: true, description: 'Smarter. Brighter.', images: ['https://images.unsplash.com/photo-1434493907317-a46b53b81887?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Galaxy Watch 6 Classic', price: 7990000, stock: 15, brand_id: brands[1]._id, category_id: categories[3]._id, description: 'Viền xoay vật lý huyền thoại.', images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'] },

            // Audio
            { name: 'AirPods Pro Gen 2', price: 5990000, stock: 100, brand_id: brands[0]._id, category_id: categories[4]._id, is_featured: true, description: 'Chống ồn chủ động đỉnh cao.', images: ['https://images.unsplash.com/photo-1600294037562-b9e7ae5ef056?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Sony WH-1000XM5', price: 7490000, stock: 20, brand_id: brands[4]._id, category_id: categories[4]._id, description: 'King of Noise Cancelling.', images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80'] },
            { name: 'Lumina Sonic Pro Max', price: 3490000, stock: 60, brand_id: brands[4]._id, category_id: categories[4]._id, description: 'Âm thanh hi-res trung thực.', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'] }
        ];

        const products = await Product.insertMany(productsData);

        console.log('Seeding 50 Orders (Last 30 days)...');
        const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const paymentStatuses = ['pending', 'paid', 'failed'];
        const paymentMethods = ['cod', 'bank_transfer', 'momo'];

        const orders = [];
        const orderItems = [];

        for (let i = 0; i < 50; i++) {
            const user = users[Math.floor(Math.random() * (users.length - 1)) + 1]; // Skip admin
            const status = i < 30 ? 'delivered' : orderStatuses[Math.floor(Math.random() * orderStatuses.length)]; // Force some delivered
            const payment_status = status === 'delivered' ? 'paid' : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
            const payment_method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            // Random date in last 30 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            // Select 1-3 random products
            const numItems = Math.floor(Math.random() * 3) + 1;
            let totalPrice = 0;
            const currentOrderItems = [];

            for (let j = 0; j < numItems; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 2) + 1;
                totalPrice += product.price * qty;
                currentOrderItems.push({
                    product_id: product._id,
                    quantity: qty,
                    price: product.price
                });
            }

            const order = new Order({
                user_id: user._id,
                total_price: totalPrice,
                status: status,
                payment_method: payment_method,
                payment_status: payment_status,
                shipping_address: 'Số ' + (i + 1) * 7 + ', Đường Lê Lợi, Quận 1, TP.HCM',
                recipient_name: user.name,
                recipient_email: user.email,
                recipient_phone: '090' + Math.floor(1000000 + Math.random() * 9000000),
                created_at: date
            });

            const savedOrder = await order.save();
            
            for (const itemData of currentOrderItems) {
                orderItems.push({
                    order_id: savedOrder._id,
                    ...itemData
                });
            }
        }

        await OrderItem.insertMany(orderItems);

        console.log('Seed EXTENDED database created successfully!');
        process.exitCode = 0;
    } catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedData();