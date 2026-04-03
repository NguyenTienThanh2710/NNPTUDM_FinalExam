import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

<<<<<<< HEAD
const ORDER_STATUS_CONFIG = {
    pending: { label: 'Chờ thanh toán', color: 'text-amber-700', bg: 'bg-amber-100', icon: 'schedule' },
    processing: { label: 'Đang chuẩn bị', color: 'text-blue-700', bg: 'bg-blue-100', icon: 'inventory_2' },
    shipped: { label: 'Đang giao', color: 'text-blue-700', bg: 'bg-blue-100', icon: 'local_shipping' },
    delivered: { label: 'Hoàn thành', color: 'text-green-700', bg: 'bg-green-100', icon: 'package_2' },
    cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100', icon: 'cancel' },
};

=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
<<<<<<< HEAD
    const [filter, setFilter] = useState('all');
=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
                setLoading(false);
            } catch (_err) {
<<<<<<< HEAD
                setError('Không thể lấy lịch sử đơn hàng. Vui lòng thử lại sau.');
=======
                setError('Không thể lấy lịch sử đơn hàng');
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

<<<<<<< HEAD
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'pending';
        if (filter === 'shipped') return order.status === 'shipped' || order.status === 'processing';
        if (filter === 'delivered') return order.status === 'delivered';
        if (filter === 'cancelled') return order.status === 'cancelled';
        return true;
    });

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-surface">
                <div className="flex flex-col items-center gap-3 text-outline">
                    <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
                    <p className="font-bold text-sm uppercase tracking-widest">Đang tải đơn hàng...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen font-body text-on-surface bg-surface antialiased text-left">
            {/* Header Section */}
            <section className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Lịch sử đơn hàng</h1>
                <p className="text-on-surface-variant text-lg">Theo dõi và quản lý các giao dịch của bạn với Precision Luminescence.</p>
            </section>

            {/* Filters (Bento Style Chip Container) */}
            <div className="mb-10 flex flex-wrap gap-3 items-center">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: 'Chờ thanh toán' },
                    { id: 'shipped', label: 'Đang giao' },
                    { id: 'delivered', label: 'Hoàn thành' },
                    { id: 'cancelled', label: 'Đã hủy' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${filter === item.id ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex items-center gap-4 text-red-700 animate-fade-in shadow-sm">
                    <span className="material-symbols-outlined text-3xl">error</span>
                    <p className="font-bold text-lg">{error}</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="py-24 text-center bg-surface-container-lowest rounded-[40px] shadow-sm border border-slate-100 animate-fade-in">
                    <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-outline text-5xl">receipt_long</span>
                    </div>
                    <h3 className="text-2xl font-black text-on-surface mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-on-surface-variant font-medium mb-8 max-w-xs mx-auto text-lg">Bạn vẫn chưa thực hiện bất kỳ giao dịch mua sắm nào tại Lumina Mobile.</p>
                    <Link to="/products" className="inline-block px-10 py-4 bg-primary text-on-primary rounded-xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 text-lg">
                        Khám phá sản phẩm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((order) => {
                        const status = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.pending;
                        return (
                            <article
                                key={order._id}
                                className="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-[0_20px_40px_rgba(26,28,29,0.04)] group animate-fade-in text-left"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-xl ${status.bg} flex items-center justify-center ${status.color}`}>
                                        <span className="material-symbols-outlined text-3xl font-variation-settings-fill-1">{status.icon}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold tracking-widest text-primary uppercase">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${status.bg} ${status.color} uppercase tracking-wider`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-on-surface line-clamp-1">Thiết bị từ Lumina Mobile</h3>
                                        <p className="text-sm text-on-surface-variant">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN', { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end w-full md:w-auto border-t md:border-none pt-6 md:pt-0 gap-4">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-on-surface-variant font-medium uppercase tracking-tighter mb-1">Tổng thanh toán</p>
                                        <p className="text-3xl font-black text-on-surface">
                                            {order.total_price.toLocaleString()} ₫
                                        </p>
                                    </div>
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="bg-primary hover:bg-primary-container text-on-primary px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                                    >
                                        Xem chi tiết
                                        <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}


=======
    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <main>
            <section className="section-block">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">Orders</span>
                        <h2>Lịch Sử Đơn Hàng</h2>
                    </div>
                </div>
                {orders.length === 0 ? (
                    <div className="empty-state">Bạn chưa có đơn hàng nào.</div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <article className="order-card" key={order._id}>
                                <span className={`status-pill ${order.status === 'delivered' ? 'delivered' : ''}`}>
                                    {order.status}
                                </span>
                                <h3>Mã đơn hàng: {order._id}</h3>
                                <p>Ngày đặt: {new Date(order.created_at).toLocaleString()}</p>
                                <p>Tổng tiền: {order.total_price.toLocaleString()} VNĐ</p>
                                <Link className="text-link" to={`/orders/${order._id}`}>Xem chi tiết</Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        </main>
    );
};

export default OrderHistory;
