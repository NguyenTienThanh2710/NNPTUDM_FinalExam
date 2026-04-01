# Frontend - Website Quản Lý Cửa Hàng Điện Thoại

Phần giao diện người dùng của dự án, được xây dựng bằng **React** và **Vite**.

## 1. Công nghệ sử dụng
- **React 18**: Thư viện UI chính.
- **Vite**: Công cụ build và dev server cực nhanh.
- **Axios**: Gọi API từ Backend.
- **React Router Dom**: Quản lý điều hướng trang (Routing).
- **CSS thuần**: Giao diện cơ bản (có thể mở rộng sang Tailwind/Bootstrap).

## 2. Các trang (Views) đã hoàn thành
- **Trang chủ (`/`)**: Giới thiệu và chào mừng.
- **Đăng ký (`/register`)**: Form tạo tài khoản mới.
- **Đăng nhập (`/login`)**: Xác thực và lưu trữ token.
- **Danh sách Sản phẩm (`/products`)**: Hiển thị tất cả sản phẩm với hình ảnh và giá.
- **Chi tiết Sản phẩm (`/products/:id`)**: Xem thông tin chi tiết từng sản phẩm.
- **Danh sách Thương hiệu (`/brands`)**: Hiển thị các thương hiệu đối tác.
- **Danh sách Danh mục (`/categories`)**: Hiển thị các nhóm sản phẩm.

## 3. Cấu trúc thư mục quan trọng
- `src/services/api.js`: Cấu hình Axios để kết nối với Backend (cổng 5000).
- `src/pages/`: Chứa mã nguồn của các trang.
- `src/App.jsx`: Quản lý Routes và Thanh Menu (Navbar).

## 4. Cách chạy Frontend

**Bước 1: Cài đặt thư viện**
Mở terminal, vào thư mục `frontend` và chạy:
```bash
npm install
```

**Bước 2: Khởi chạy ứng dụng**
Chạy lệnh sau:
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại: `http://localhost:5173`

**Lưu ý:** Hãy đảm bảo Backend đã được khởi chạy tại cổng 5000 trước khi sử dụng các chức năng gọi dữ liệu.
