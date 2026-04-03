import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrandList from './pages/BrandList';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CategoryList from './pages/CategoryList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import OrderSuccess from './pages/OrderSuccess';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';
import AdminCustomers from './pages/AdminCustomers';
import AdminStatistics from './pages/AdminStatistics';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminBrands from './pages/AdminBrands';

import ProtectedRoute from './components/ProtectedRoute'; // Ensure this matches User's additions

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased font-body">
        <Header />
        
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/brands" element={<BrandList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute requireAdmin={true}><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute requireAdmin={true}><AdminCategories /></ProtectedRoute>} />
            <Route path="/admin/brands" element={<ProtectedRoute requireAdmin={true}><AdminBrands /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requireAdmin={true}><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/orders/:id" element={<ProtectedRoute requireAdmin={true}><AdminOrderDetail /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute requireAdmin={true}><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/statistics" element={<ProtectedRoute requireAdmin={true}><AdminStatistics /></ProtectedRoute>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
