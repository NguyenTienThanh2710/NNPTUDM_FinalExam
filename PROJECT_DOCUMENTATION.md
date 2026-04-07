# 📱 BÁO CÁO TOÀN DIỆN DỰ ÁN: WEBSITE QUẢN LÝ CỬA HÀNG ĐIỆN THOẠI

## I. THÔNG TIN DỰ ÁN CHUNG

### A. Mô Tả Tổng Quan
Đây là một hệ thống **e-commerce toàn diện** cho quản lý cửa hàng bán lẻ điện thoại, bao gồm:
- **Giao diện người dùng (Frontend)**: React + Vite + Tailwind CSS
- **Hệ thống xử lý (Backend)**: Node.js + Express + MongoDB
- **Triển khai**: Docker + Docker Compose
- **Xác thực**: JWT (JSON Web Token)
- **Phân quyền**: 2 vai trò chính (ADMIN & USER)

### B. Công Nghệ Stack
```
BACKEND:
├── Runtime: Node.js
├── Framework: Express.js 5.2.1
├── Database: MongoDB + Mongoose 9.3.3
├── Authentication: JWT 9.0.3 + bcryptjs 3.0.3
├── File Upload: Multer 2.0.2
├── External APIs: Google Auth Library 10.6.2
└── Utilities: CORS, dotenv, MongoDB-memory-server

FRONTEND:
├── UI Framework: React 19.2.4
├── Build Tool: Vite 8.0.1
├── Styling: Tailwind CSS 3.4.19
├── HTTP Client: Axios 1.14.0
├── Routing: React Router DOM 7.13.2
├── Google Login: @react-oauth/google 0.13.4
├── PDF Export: jsPDF 4.2.1 + jspdf-autotable 5.0.7
└── Token Decode: jwt-decode 4.0.0

DEPLOYMENT:
├── Containerization: Docker
├── Orchestration: Docker Compose
└── Database: MongoDB 7
```

---

## II. KIẾN TRÚC HỆ THỐNG

### A. Cấu Trúc Thư Mục Backend
```
backend/
├── app.js                          # Entry point, server config
├── seed.js                         # Dữ liệu khởi tạo
├── package.json
├── Dockerfile
└── src/
    ├── controllers/                # Business logic
    │   ├── auth.controller.js      # Đăng ký, đăng nhập
    │   ├── product.controller.js   # Quản lý sản phẩm
    │   ├── brand.controller.js     # Quản lý thương hiệu
    │   ├── category.controller.js  # Quản lý danh mục
    │   ├── cart.controller.js      # Quản lý giỏ hàng
    │   ├── order.controller.js     # Quản lý đơn hàng
    │   ├── review.controller.js    # Quản lý đánh giá
    │   ├── wishlist.controller.js  # Quản lý danh sách yêu thích
    │   └── location.controller.js  # Quản lý vị trí
    │
    ├── models/                     # Database schemas
    │   ├── user.model.js           # User schema
    │   ├── product.model.js        # Product schema
    │   ├── brand.model.js          # Brand schema
    │   ├── category.model.js       # Category schema
    │   ├── cart.model.js           # Cart schema
    │   ├── cartItem.model.js       # CartItem schema
    │   ├── order.model.js          # Order schema
    │   ├── orderItem.model.js      # OrderItem schema
    │   ├── orderStatusHistory.model.js  # Order status history
    │   ├── review.model.js         # Review schema
    │   ├── role.model.js           # Role schema
    │   └── wishlist.model.js       # Wishlist schema
    │
    ├── routes/                     # API endpoints
    │   ├── auth.route.js
    │   ├── product.route.js
    │   ├── brand.route.js
    │   ├── category.route.js
    │   ├── cart.route.js
    │   ├── order.route.js
    │   ├── review.route.js
    │   ├── wishlist.route.js
    │   ├── admin.route.js
    │   └── location.route.js
    │
    ├── middleware/
    │   └── auth.middleware.js      # JWT protection + authorization
    │
    └── data/
        └── locations.js            # Dữ liệu địa điểm
```

### B. Cấu Trúc Thư Mục Frontend
```
frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── Dockerfile
├── index.html
└── src/
    ├── App.jsx                     # Root component + routing
    ├── main.jsx                    # Entry point
    ├── css/
    │   ├── App.css
    │   └── index.css
    │
    ├── components/
    │   ├── Header.jsx              # Navigation bar
    │   ├── Footer.jsx              # Footer
    │   ├── AdminFooter.jsx         # Admin footer
    │   ├── ProtectedRoute.jsx      # Protected route wrapper
    │   └── ScrollToTop.jsx         # Scroll-to-top component
    │
    ├── pages/
    │   ├── Home.jsx                # Trang chủ
    │   ├── Login.jsx               # Đăng nhập
    │   ├── Register.jsx            # Đăng ký
    │   ├── ProductList.jsx         # Danh sách sản phẩm (có filter/sort)
    │   ├── ProductDetail.jsx       # Chi tiết sản phẩm
    │   ├── BrandList.jsx           # Danh sách thương hiệu
    │   ├── CategoryList.jsx        # Danh sách danh mục
    │   ├── Cart.jsx                # Giỏ hàng (multiselect)
    │   ├── Checkout.jsx            # Thanh toán
    │   ├── OrderHistory.jsx        # Lịch sử đơn hàng
    │   ├── OrderDetail.jsx         # Chi tiết đơn hàng
    │   ├── Wishlist.jsx            # Danh sách yêu thích
    │   ├── Profile.jsx             # Hồ sơ người dùng
    │   │
    │   ├── AdminLayout.jsx         # Admin layout wrapper
    │   ├── AdminDashboard.jsx      # Dashboard với thống kê
    │   ├── AdminProducts.jsx       # Quản lý sản phẩm
    │   ├── AdminCategories.jsx     # Quản lý danh mục
    │   ├── AdminBrands.jsx         # Quản lý thương hiệu
    │   ├── AdminOrders.jsx         # Quản lý đơn hàng
    │   ├── AdminCustomers.jsx      # Quản lý khách hàng
    │   ├── AdminReviews.jsx        # Quản lý đánh giá
    │   └── AdminWishlistStats.jsx  # Thống kê wishlist
    │
    ├── services/
    │   ├── api.js                  # Axios instance + interceptor
    │   └── wishlist.service.js    # Wishlist service
    │
    └── utils/
        ├── auth.js                 # Auth helpers
        └── imageUtils.js           # Image URL builder
```

---

## III. DATABASE MODELS (SCHEMAS)

### A. User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role_id: ObjectId (ref: Role),
  avatar: String,
  phone: String,
  address: String,
  is_vip: Boolean (default: false),
  status: 'active' | 'locked',
  createdAt: Date
}
```

### B. Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  price: Number (required, min: 0),
  description: String,
  stock: Number (default: 0),
  images: [String],
  category_id: ObjectId (ref: Category),
  brand_id: ObjectId (ref: Brand),
  is_visible: Boolean (default: true),
  avg_rating: Number (default: 0),
  num_reviews: Number (default: 0)
}
```

### C. Order Model
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  total_price: Number,
  city: String,
  district: String,
  ward: String,
  street_address: String,
  phone_number: String,
  payment_method: 'COD' | 'BANK_TRANSFER',
  payment_status: 'pending' | 'paid' | 'failed',
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  created_at: Date
}
```

### D. Cart Model
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User, required)
}
```

### E. CartItem Model
```javascript
{
  _id: ObjectId,
  cart_id: ObjectId (ref: Cart),
  product_id: ObjectId (ref: Product),
  quantity: Number
}
```

### F. Wishlist Model
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  product_id: ObjectId (ref: Product),
  created_at: Date
}
// Unique index: { user_id: 1, product_id: 1 }
```

### G. Review Model
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  product_id: ObjectId (ref: Product),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

### H. Các Models Khác
- **Brand Model**: { _id, name, description }
- **Category Model**: { _id, name, description }
- **Role Model**: { _id, name, description }
- **OrderItem Model**: { _id, order_id, product_id, quantity }
- **OrderStatusHistory Model**: { _id, order_id, status, created_at }

---

## IV. API ENDPOINTS

### A. Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Đăng ký tài khoản mới | None |
| POST | `/login` | Đăng nhập | None |
| POST | `/google-login` | Đăng nhập với Google | None |

### B. Product Routes (`/api/products`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy danh sách sản phẩm | Optional |
| GET | `/:id` | Lấy chi tiết sản phẩm | Optional |
| POST | `/` | Tạo sản phẩm mới | Admin |
| PUT | `/:id` | Cập nhật sản phẩm | Admin |
| DELETE | `/:id` | Xóa sản phẩm | Admin |

### C. Cart Routes (`/api/cart`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy giỏ hàng | User |
| POST | `/` | Thêm vào giỏ hàng | User |
| PUT | `/:id` | Cập nhật số lượng | User |
| DELETE | `/:id` | Xóa sản phẩm khỏi giỏ | User |
| DELETE | `/` | Xóa toàn bộ giỏ | User |

### D. Order Routes (`/api/orders`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy đơn hàng của người dùng | User |
| GET | `/:id` | Chi tiết đơn hàng | User |
| POST | `/` | Tạo đơn hàng mới | User |
| PUT | `/:id` | Cập nhật đơn hàng | Admin |
| GET | `/dashboard` | Dashboard stats | Admin |
| GET | `/all` | Tất cả đơn hàng | Admin |

### E. Review Routes (`/api/reviews`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Thêm đánh giá | User |
| GET | `/product/:productId` | Lấy đánh giá sản phẩm | None |
| GET | `/can-review/:productId` | Kiểm tra có thể đánh giá | User |

### F. Wishlist Routes (`/api/wishlist`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy danh sách yêu thích | User |
| POST | `/` | Thêm vào danh sách yêu thích | User |
| DELETE | `/:productId` | Xóa khỏi danh sách yêu thích | User |

### G. Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats/wishlist` | Thống kê wishlist | Admin |
| GET | `/customers` | Danh sách khách hàng | Admin |

### H. Brand & Category Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/brands` | Danh sách thương hiệu | None |
| POST | `/brands` | Tạo thương hiệu | Admin |
| PUT | `/brands/:id` | Cập nhật thương hiệu | Admin |
| DELETE | `/brands/:id` | Xóa thương hiệu | Admin |
| GET | `/categories` | Danh sách danh mục | None |
| POST | `/categories` | Tạo danh mục | Admin |
| PUT | `/categories/:id` | Cập nhật danh mục | Admin |
| DELETE | `/categories/:id` | Xóa danh mục | Admin |

### I. Upload Route
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/upload` | Upload hình ảnh | Admin |

---

## V. CHỨC NĂNG HỆ THỐNG

### A. Tính Năng Đã Hoàn Thành ✅

#### 1. **Xác Thực & Phân Quyền**
- ✅ Đăng ký tài khoản với email
- ✅ Đăng nhập với JWT token
- ✅ Đăng nhập với Google OAuth
- ✅ Bảo vệ API bằng JWT middleware
- ✅ Phân quyền Admin/User

#### 2. **Quản Lý Sản Phẩm**
- ✅ Xem danh sách sản phẩm (có pagination)
- ✅ Xem chi tiết sản phẩm
- ✅ Tạo/Sửa/Xóa sản phẩm (Admin only)
- ✅ Filter theo danh mục, thương hiệu
- ✅ Lọc theo giá
- ✅ Sắp xếp: phổ biến, giá thấp/cao, mới nhất
- ✅ Hiển thị/ẩn sản phẩm

#### 3. **Quản Lý Danh Mục & Thương Hiệu**
- ✅ Xem danh sách danh mục
- ✅ Xem danh sách thương hiệu
- ✅ CRUD danh mục (Admin only)
- ✅ CRUD thương hiệu (Admin only)

#### 4. **Giỏ Hàng**
- ✅ Xem giỏ hàng
- ✅ Thêm sản phẩm vào giỏ
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Xóa toàn bộ giỏ
- ✅ Kiểm tra tồn kho
- ✅ **Multi-select**: Chọn nhiều sản phẩm để thanh toán

#### 5. **Đơn Hàng**
- ✅ Tạo đơn hàng từ giỏ hàng
- ✅ Chọn phương thức thanh toán (COD / BANK_TRANSFER)
- ✅ Nhập địa chỉ giao hàng (thành phố, quận, phường, địa chỉ)
- ✅ Xem lịch sử đơn hàng của người dùng
- ✅ Xem chi tiết đơn hàng
- ✅ Quản lý trạng thái đơn hàng (Admin)
- ✅ Dashboard thống kê doanh thu (Admin)
- ✅ Xuất PDF đơn hàng

#### 6. **Đánh Giá Sản Phẩm**
- ✅ Đánh giá sản phẩm (1-5 sao)
- ✅ Bình luận đánh giá
- ✅ Kiểm tra quyền đánh giá (chỉ người mua)
- ✅ Cập nhật rating trung bình sản phẩm
- ✅ Admin xem tất cả đánh giá

#### 7. **Danh Sách Yêu Thích (Wishlist)**
- ✅ Xem danh sách sản phẩm yêu thích
- ✅ Thêm sản phẩm vào wishlist
- ✅ Xóa sản phẩm khỏi wishlist
- ✅ Thống kê sản phẩm được yêu thích nhiều nhất (Admin)

#### 8. **Thông Tin Người Dùng**
- ✅ Xem hồ sơ người dùng
- ✅ Avatar người dùng

#### 9. **Upload Hình Ảnh**
- ✅ Upload ảnh cho sản phẩm
- ✅ Hỗ trợ các định dạng: JPEG, PNG, WebP, GIF, SVG
- ✅ Giới hạn kích thước: 5MB
- ✅ Lưu trữ trên server

#### 10. **Admin Dashboard**
- ✅ Thống kê doanh thu theo tháng
- ✅ Thống kê số lượng đơn hàng
- ✅ Danh sách đơn hàng mới nhất
- ✅ Thống kê wishlist
- ✅ Refresh real-time (auto-sync 60 giây)

#### 11. **Giao Diện UI/UX**
- ✅ Tailwind CSS styling
- ✅ Material Design icons
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications (notice)

### B. Tính Năng Chưa Hoàn Thành ⏳

#### 1. **Thanh Toán**
- ⏳ Integration Stripe/PayPal
- ⏳ Xác nhận thanh toán online

#### 2. **Email Notification**
- ⏳ Gửi email xác nhận đơn hàng
- ⏳ Gửi email cập nhật trạng thái đơn hàng

#### 3. **Tìm Kiếm Nâng Cao**
- ⏳ Full-text search
- ⏳ Tìm kiếm theo tên, mô tả

#### 4. **Đánh Giá Nâng Cao**
- ⏳ Hiển thị đánh giá có ảnh/video
- ⏳ Like/dislike đánh giá

#### 5. **Hệ Thống Giám Sát**
- ⏳ Logging chi tiết
- ⏳ Analytics user behavior
- ⏳ Performance monitoring

#### 6. **Chatbot Hỗ Trợ**
- ⏳ Customer support chatbot
- ⏳ FAQ automation

---

## VI. FLOW CHÍNH CỦA ỨNG DỤNG

### A. User Flow (Khách Hàng)
```
1. Truy cập trang chủ (Home)
   ↓
2. Lựa chọn:
   a) Duyệt sản phẩm (ProductList - filter/sort)
   b) Xem thương hiệu (BrandList)
   c) Xem danh mục (CategoryList)
   ↓
3. Xem chi tiết sản phẩm (ProductDetail)
   - Đánh giá sản phẩm
   - Thêm vào wishlist
   - Thêm vào giỏ hàng
   ↓
4. Quản lý giỏ hàng (Cart)
   - Xem danh sách sản phẩm
   - Cập nhật số lượng
   - Chọn sản phẩm để thanh toán (multi-select)
   ↓
5. Thanh toán (Checkout)
   - Nhập địa chỉ giao hàng
   - Chọn phương thức thanh toán
   - Xác nhận đơn hàng
   ↓
6. Xem lịch sử đơn hàng (OrderHistory)
   - Xem chi tiết đơn hàng (OrderDetail)
   - Theo dõi trạng thái
   ↓
7. Quản lý danh sách yêu thích (Wishlist)
   - Xem sản phẩm yêu thích
   - Xóa khỏi danh sách
   ↓
8. Quản lý hồ sơ (Profile)
   - Xem thông tin cá nhân
   - Cập nhật avatar
```

### B. Admin Flow (Quản Trị Viên)
```
1. Đăng nhập (Login)
   → Chuyển hướng đến Admin Dashboard
   ↓
2. Admin Dashboard
   - Xem thống kê doanh thu
   - Xem danh sách đơn hàng mới
   - Xem thống kê wishlist
   ↓
3. Quản lý sản phẩm (AdminProducts)
   - Xem danh sách sản phẩm
   - Tạo sản phẩm mới (upload hình ảnh)
   - Sửa thông tin sản phẩm
   - Xóa sản phẩm
   ↓
4. Quản lý danh mục (AdminCategories)
   - CRUD danh mục
   ↓
5. Quản lý thương hiệu (AdminBrands)
   - CRUD thương hiệu
   ↓
6. Quản lý đơn hàng (AdminOrders)
   - Xem tất cả đơn hàng
   - Cập nhật trạng thái đơn hàng
   - Xem chi tiết đơn hàng
   ↓
7. Quản lý khách hàng (AdminCustomers)
   - Xem danh sách khách hàng
   - Xem thông tin chi tiết
   ↓
8. Quản lý đánh giá (AdminReviews)
   - Xem tất cả đánh giá
   - Xóa đánh giá (nếu cần)
   ↓
9. Thống kê Wishlist (AdminWishlistStats)
   - Xem sản phẩm được yêu thích nhiều nhất
```

---

## VII. TRIỂN KHAI (DEPLOYMENT)

### A. Cấu Hình Docker Compose
```yaml
services:
  mongo:
    - Image: mongo:7
    - Port: 27017
    - Volume: mongo_data

  backend:
    - Context: ./backend
    - Port: 5000
    - Env:
      - MONGO_URI: mongodb://mongo:27017/nnptudm_finalexam
      - JWT_SECRET: dev-secret
      - PORT: 5000

  frontend:
    - Context: ./frontend
    - Port: 4173
    - Build Args:
      - VITE_API_URL: http://localhost:5000/api
```

### B. Hướng Dẫn Chạy Dự Án

#### 1. **Chạy trực tiếp (Development)**
```bash
# Terminal 1: Backend
cd backend
npm install
node app.js          # Chạy server trên port 5000
# hoặc: npm run seed  # Để seed dữ liệu initial

# Terminal 2: Frontend
cd frontend
npm install
npm run dev          # Chạy dev server trên port 5173
```

#### 2. **Chạy với Docker**
```bash
# Từ thư mục gốc
docker-compose up --build

# Backend: http://localhost:5000
# Frontend: http://localhost:4173
# MongoDB: localhost:27017
```

### C. Tài Khoản Demo (Sau khi seed)
```
ADMIN:
  Email: admin@example.com
  Password: password123

USER:
  Email: user@example.com
  Password: password123
  
USER (VIP):
  Email: vipuser@example.com
  Password: password123
```

---

## VIII. MIDDLEWARE & SECURITY

### A. Authentication Middleware
```javascript
// protect: Yêu cầu JWT token
// optionalProtect: JWT token không bắt buộc
// admin: Kiểm tra quyền ADMIN
```

### B. Bảo Mật
- ✅ Password hashing với bcryptjs (salt rounds: 10)
- ✅ JWT token expiry: 5 giờ
- ✅ CORS enabled
- ✅ Input validation
- ✅ File upload validation (type + size)

---

## IX. CÔNG NGHỆ & THƯ VIỆN CHI TIẾT

### Backend Dependencies
- **express** 5.2.1: Web framework
- **mongoose** 9.3.3: MongoDB ODM
- **jsonwebtoken** 9.0.3: JWT generation/verification
- **bcryptjs** 3.0.3: Password hashing
- **cors** 2.8.6: Cross-Origin Resource Sharing
- **multer** 2.0.2: File upload middleware
- **dotenv** 17.3.1: Environment variables
- **google-auth-library** 10.6.2: Google OAuth

### Frontend Dependencies
- **react** 19.2.4: UI library
- **react-router-dom** 7.13.2: Routing
- **axios** 1.14.0: HTTP client
- **tailwindcss** 3.4.19: CSS framework
- **vite** 8.0.1: Build tool
- **jsPDF** 4.2.1: PDF generation
- **@react-oauth/google** 0.13.4: Google login

---

## X. CẤU HÌNH ENVIROMENT

### Backend (.env hoặc env vars)
```
MONGO_URI=mongodb://localhost:27017/nnptudm_finalexam
MONGO_DB_NAME=nnptudm_finalexam
JWT_SECRET=your_secret_key_here_at_least_12_chars
PORT=5000
NODE_ENV=development
```

### Frontend (Vite env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## XI. THỬ NGHIỆM & DEBUGGING

### A. Kiểm Tra Backend
- API testing tools: Postman, Insomnia, Thunder Client
- API base URL: `http://localhost:5000/api`
- Header cần: `Authorization: Bearer <token>`

### B. Kiểm Tra Frontend
- Dev tools: F12 hoặc DevTools
- Network tab: Kiểm tra API calls
- Console: Debug logs
- Local Storage: Kiểm tra token

### C. Database
- MongoDB Compass: Kết nối tại `mongodb://localhost:27017`
- Xem collections, documents
- Query & aggregation

---

## XII. HIỆU NĂNG & TỐI ƯU HÓA

### A. Backend
- ✅ Populate relations: Giảm N+1 queries
- ✅ Pagination: Giới hạn dữ liệu per request
- ✅ Index trên unique fields (email, product_id+user_id)
- ✅ Error handling: Try-catch blocks

### B. Frontend
- ✅ Component lazy loading
- ✅ Image optimization: `getImageURL()` helper
- ✅ Axios interceptors: Tự động token handling
- ✅ State management: Local state + API caching

---

## XIII. LỖI THƯỜNG GẶP & GIẢI PHÁP

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|----------|
| MongoDB connection error | MongoDB không chạy | Chạy MongoDB service hoặc Docker |
| CORS error | Frontend port khác backend | Kiểm tra CORS config, đúng origin |
| 401 Unauthorized | Token không hợp lệ/hết hạn | Đăng nhập lại, refresh token |
| 403 Forbidden | Không đủ quyền | Kiểm tra role, phải là ADMIN |
| Product out of stock | Stock <= 0 | Cập nhật stock trong Admin |
| Image not uploading | File size quá lớn | Giới hạn 5MB, định dạng hợp lệ |

---

## XIV. CÁCH MỞ RỘNG/PHÁT TRIỂN

### A. Thêm Tính Năng Mới
1. Tạo Model (nếu cần)
2. Tạo Controller
3. Tạo Route
4. Tạo Frontend Page (nếu cần)
5. Integrate API

### B. Thêm Model Mới
```javascript
// src/models/newmodel.model.js
const NewModelSchema = new Schema({ ... });
module.exports = mongoose.model('NewModel', NewModelSchema);
```

### C. Thêm Route Mới
```javascript
// src/routes/newmodel.route.js
const router = express.Router();
router.get('/', controller.getAll);
module.exports = router;

// Trong app.js
app.use('/api/newmodel', newmodelRoutes);
```

---

## XV. LIÊN HỆ & GHI CHÍNH

- **Dự án**: Website Quản Lý Cửa Hàng Điện Thoại
- **Loại**: Full-stack e-commerce
- **Stack**: MERN + MongoDB + JWT
- **Deployment**: Docker Compose
- **Status**: Đang phát triển
- **Phiên bản**: 1.0.0

---

## XVI. FILE & THƯ MỤC QUAN TRỌNG

- `backend/app.js` - Entry point backend
- `backend/seed.js` - Dữ liệu khởi tạo
- `frontend/src/App.jsx` - Root component
- `docker-compose.yml` - Docker orchestration
- `backend/package.json` - Backend dependencies
- `frontend/package.json` - Frontend dependencies
- `backend/src/middleware/auth.middleware.js` - JWT logic
- `frontend/src/services/api.js` - Axios config

---

**Tài liệu này được tạo ngày: 07/04/2026**
**Phiên bản tài liệu: 1.0**
