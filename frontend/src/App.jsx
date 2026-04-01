import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BrandList from './pages/BrandList';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CategoryList from './pages/CategoryList';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Trang chủ</Link>
          <Link to="/products" style={{ marginRight: '10px' }}>Sản phẩm</Link>
          <Link to="/cart" style={{ marginRight: '10px' }}>Giỏ hàng</Link>
          <Link to="/orders" style={{ marginRight: '10px' }}>Đơn hàng</Link>
          <Link to="/brands" style={{ marginRight: '10px' }}>Thương hiệu</Link>
          <Link to="/categories" style={{ marginRight: '10px' }}>Danh mục</Link>
          <Link to="/login" style={{ marginRight: '10px' }}>Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/brands" element={<BrandList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/" element={<h2>Chào mừng đến với cửa hàng điện thoại!</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
