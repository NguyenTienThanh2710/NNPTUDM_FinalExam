# Website Quản Lý Cửa Hàng Điện Thoại

Hệ thống quản lý cửa hàng điện thoại bao gồm giao diện người dùng (Frontend) và hệ thống xử lý (Backend).

## 1. Cấu trúc dự án
Dự án được chia làm hai phần chính:
- **`backend/`**: Xây dựng bằng Node.js, Express, và MongoDB.
- **`frontend/`**: Xây dựng bằng React và Vite.

## 2. Các công nghệ sử dụng
### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- CORS (Kết nối với Frontend)

### Frontend
- React 18 & Vite
- Axios (Giao tiếp API)
- React Router (Điều hướng)

## 3. Chức năng hệ thống
### Phân quyền Admin & User
- Đăng ký / Đăng nhập (JWT).
- Phân quyền: Chỉ Admin mới có thể thêm/sửa/xóa sản phẩm, danh mục, thương hiệu.

### Quản lý sản phẩm
- Xem danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Quản lý danh mục & thương hiệu.

## 4. Hướng dẫn cài đặt nhanh

### Chạy Backend
1. Mở terminal tại thư mục `backend/`.
2. Chạy `npm install`.
3. Cấu hình file `.env` (Chuỗi kết nối MongoDB và JWT_SECRET).
4. Chạy `node app.js`.
*(Xem chi tiết tại `backend/README.md`)*

### Chạy Frontend
1. Mở terminal mới tại thư mục `frontend/`.
2. Chạy `npm install`.
3. Chạy `npm run dev`.
*(Xem chi tiết tại `frontend/README.md`)*

## 5. Phân công công việc (Tóm tắt)
- **Thành viên 1:** Xây dựng 8 Models chính, Authentication, Authorization, và các chức năng CRUD cho Sản phẩm, Danh mục, Thương hiệu (Backend & Frontend cơ bản).
- **Các thành viên khác:** Xây dựng các chức năng Giỏ hàng, Đơn hàng, Yêu thích, Đánh giá, Thanh toán...
