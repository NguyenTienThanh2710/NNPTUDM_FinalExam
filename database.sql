-- Tạo database
CREATE DATABASE IF NOT EXISTS phone_store_db;
USE phone_store_db;

-- 1. Bảng Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Bảng Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role_id INT NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. Bảng Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 4. Bảng Brands
CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 5. Bảng Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- 6. Bảng Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    category_id INT,
    brand_id INT,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 7. Bảng Customers
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 9. Bảng Order Details
CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 10. Bảng Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- =============================
-- INSERT SAMPLE DATA
-- =============================

-- Roles
INSERT INTO roles (role_name) VALUES
('Admin'),
('Staff');

-- Users
INSERT INTO users (username, password, email, full_name, role_id, avatar) VALUES
('admin','123456','admin@store.com','Administrator',1,'admin.png'),
('staff01','123456','staff01@store.com','Nguyen Van A',2,'staff1.png'),
('staff02','123456','staff02@store.com','Tran Thi B',2,'staff2.png');

-- Categories
INSERT INTO categories (category_name, description) VALUES
('Smartphone','Điện thoại thông minh'),
('Tablet','Máy tính bảng'),
('Accessory','Phụ kiện điện thoại');

-- Brands
INSERT INTO brands (brand_name, description) VALUES
('Apple','Thương hiệu Apple'),
('Samsung','Thương hiệu Samsung'),
('Xiaomi','Thương hiệu Xiaomi'),
('Oppo','Thương hiệu Oppo');

-- Suppliers
INSERT INTO suppliers (supplier_name, contact_name, phone, email, address) VALUES
('Apple Vietnam Distributor','Nguyen Minh','0901111111','apple@distributor.com','Ho Chi Minh'),
('Samsung Vietnam Distributor','Tran Anh','0902222222','samsung@distributor.com','Ha Noi'),
('Xiaomi Vietnam Distributor','Le Hung','0903333333','xiaomi@distributor.com','Da Nang');

-- Products
INSERT INTO products (product_name, description, price, stock_quantity, image_url, category_id, brand_id, supplier_id) VALUES
('iPhone 15 Pro Max','Điện thoại Apple mới nhất',35000000,50,'iphone15.jpg',1,1,1),
('iPhone 14','Điện thoại Apple',25000000,40,'iphone14.jpg',1,1,1),
('Samsung Galaxy S24','Flagship Samsung',28000000,60,'s24.jpg',1,2,2),
('Samsung Galaxy A54','Samsung tầm trung',9000000,80,'a54.jpg',1,2,2),
('Xiaomi 13','Flagship Xiaomi',15000000,70,'xiaomi13.jpg',1,3,3);

-- Customers
INSERT INTO customers (full_name,email,phone,address) VALUES
('Nguyen Van Nam','nam@gmail.com','0911111111','Ho Chi Minh'),
('Tran Thi Hoa','hoa@gmail.com','0922222222','Ha Noi'),
('Le Van Binh','binh@gmail.com','0933333333','Da Nang');

-- Orders
INSERT INTO orders (customer_id,total_amount,status,shipping_address) VALUES
(1,35000000,'delivered','Ho Chi Minh'),
(2,28000000,'processing','Ha Noi'),
(3,15000000,'pending','Da Nang');

-- Order Details
INSERT INTO order_details (order_id,product_id,quantity,unit_price) VALUES
(1,1,1,35000000),
(2,3,1,28000000),
(3,5,1,15000000);

-- Reviews
INSERT INTO reviews (product_id,customer_id,rating,comment) VALUES
(1,1,5,'Sản phẩm rất tốt'),
(3,2,4,'Hiệu năng mạnh'),
(5,3,5,'Giá rẻ, cấu hình tốt');