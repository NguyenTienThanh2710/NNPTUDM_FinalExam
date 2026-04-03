# Hướng dẫn Backend - Website Quản Lý Cửa Hàng Điện Thoại

Đây là tài liệu hướng dẫn cho phần backend của dự án, được xây dựng bằng Node.js, Express, và MongoDB.

## 1. Các chức năng đã hoàn thành (Phần việc của Thành viên 1)

- **Cấu trúc dự án:**
  - Toàn bộ code backend được đặt trong thư mục `backend`.
  - Cấu trúc thư mục bao gồm `controllers`, `models`, `routes`, `middleware`.

- **Cơ sở dữ liệu Models:**
  - Đã định nghĩa 8 Mongoose Schemas cho các collection: `User`, `Product`, `Category`, `Brand`, `Order`, `OrderItem`, `Cart`, `CartItem`.

- **Xác thực & Phân quyền (Authentication & Authorization):**
  - API cho phép người dùng **đăng ký** (`/api/auth/register`) và **đăng nhập** (`/api/auth/login`).
  - Sử dụng JSON Web Token (JWT) để xác thực người dùng sau khi đăng nhập.
  - Middleware `protect` để bảo vệ các API yêu cầu đăng nhập.
  - Middleware `admin` để phân quyền cho các API chỉ dành cho `ADMIN`.

- **API Quản lý (CRUD):**
  - **Brand:** Cung cấp đầy đủ API để thêm, sửa, xóa, và lấy danh sách thương hiệu. Các chức năng quản trị đã được bảo vệ, yêu cầu quyền admin.
  - **Category:** Cung cấp đầy đủ API để quản lý danh mục. Các chức năng quản trị đã được bảo vệ.
  - **Product:** Cung cấp đầy đủ API để quản lý sản phẩm. Các chức năng quản trị đã được bảo vệ.

## 2. Các chức năng chưa hoàn thành (Dành cho các thành viên khác)

- **API cho các Models còn lại:**
  - `Order` & `OrderItem`: API để xử lý đặt hàng, xem lịch sử đơn hàng.
  - `Cart` & `CartItem`: API để quản lý giỏ hàng.
  - `Wishlist`: API cho danh sách yêu thích.
  - `Review`: API cho đánh giá sản phẩm.
  - `Address`: API cho địa chỉ người dùng.
  - `Payment`: API cho thanh toán.

- **Upload File:**
  - Chức năng upload ảnh cho sản phẩm và avatar người dùng bằng `Multer` chưa được tích hợp.

- **Chức năng nâng cao:**
  - API cho chức năng tìm kiếm và lọc sản phẩm chuyên sâu.
  - API cho dashboard thống kê.

## 3. Cách chạy Backend

Để khởi chạy server backend, hãy làm theo các bước sau:

**Bước 1: Cài đặt dependencies**

Mở terminal, di chuyển vào thư mục `backend` và chạy lệnh sau:
```bash
cd backend
npm install
```

**Bước 2: Cấu hình biến môi trường**

1.  Trong thư mục `backend`, bạn sẽ thấy file `.env`.
2.  Mở file `.env` và thay đổi các giá trị sau:
    -   `MONGO_URI`: Thay `your_mongodb_connection_string` bằng chuỗi kết nối đến MongoDB Atlas hoặc local MongoDB của bạn.
        *Ví dụ:* `MONGO_URI=mongodb://localhost:27017/shop-database`
    -   `JWT_SECRET`: Thay `your_jwt_secret` bằng một chuỗi ký tự bí mật bất kỳ để mã hóa token.
        *Ví dụ:* `JWT_SECRET=mysecretkey123`

**Bước 3: Khởi chạy Server**

Sau khi cấu hình xong, chạy lệnh sau từ thư mục `backend`:
```bash
node app.js
```

Nếu muốn tạo dữ liệu mẫu cho MongoDB, chạy thêm:
```bash
npm run seed
```

Tài khoản demo sau khi seed:
- `user@example.com` / `123456`
- `admin@example.com` / `123456`

Nếu không có lỗi, bạn sẽ thấy thông báo trên terminal:
```
MongoDB Connected...
Server running on port 5000
```

Bây giờ, backend đã sẵn sàng nhận request từ frontend hoặc các công cụ kiểm thử API như Postman.
