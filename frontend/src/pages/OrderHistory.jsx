import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const location = useLocation();
    const navigate = useNavigate();

    const mapStatus = (status) => {
        const mapping = {
            pending: { text: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700', icon: 'pending_actions' },
            processing: { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: 'inventory_2' },
            shipped: { text: 'Đang giao', color: 'bg-blue-100 text-blue-700', icon: 'local_shipping' },
            delivered: { text: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: 'package_2' },
            cancelled: { text: 'Đã huỷ', color: 'bg-red-100 text-red-700', icon: 'cancel' }
        };
        return mapping[status] || { text: status, color: 'bg-slate-100 text-slate-700', icon: 'help' };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
                setLoading(false);
            } catch (_err) {
                setError('Không thể lấy lịch sử đơn hàng');
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
        try {
            await api.put(`/orders/${orderId}/cancel`);
            setNotice({ type: 'success', text: 'Đã hủy đơn hàng thành công' });
            // Refresh orders
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Hủy đơn hàng thất bại' });
        }
    };

    useEffect(() => {
        const incoming = location.state?.notice;
        if (!incoming) return;
        setNotice(incoming);
        navigate(location.pathname, { replace: true, state: {} });
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'all') return orders;
        if (statusFilter === 'pending') return orders.filter(o => o.status === 'pending');
        if (statusFilter === 'shipping') return orders.filter(o => o.status === 'shipped' || o.status === 'processing');
        if (statusFilter === 'completed') return orders.filter(o => o.status === 'delivered');
        if (statusFilter === 'cancelled') return orders.filter(o => o.status === 'cancelled');
        return orders;
    }, [orders, statusFilter]);

    if (loading) return (
        <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-on-surface-variant font-medium">Đang tải lịch sử đơn hàng...</p>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
                <div className="bg-error-container text-on-error-container rounded-xl p-6 border border-outline-variant/10">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <div className="font-bold">{error}</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center gap-2 bg-white/60 text-on-surface px-4 py-2 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen text-left">
            {/* Header Section */}
            <section className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Lịch sử đơn hàng</h1>
                <p className="text-on-surface-variant text-lg">Theo dõi và quản lý các giao dịch của bạn với Precision Luminescence.</p>
            </section>

            {notice && (
                <div className={`mb-10 rounded-xl px-4 py-3 border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-lg">
                            {notice.type === 'success' ? 'check_circle' : notice.type === 'error' ? 'error' : 'info'}
                        </span>
                        <p className="text-sm font-semibold leading-snug">{notice.text}</p>
                        <button type="button" onClick={() => setNotice(null)} className="ml-auto text-on-surface-variant hover:opacity-80">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="mb-10 flex flex-wrap gap-3 items-center">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: 'Chờ thanh toán' },
                    { id: 'shipping', label: 'Đang giao' },
                    { id: 'completed', label: 'Hoàn thành' },
                    { id: 'cancelled', label: 'Đã hủy' }
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setStatusFilter(filter.id)}
                        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                            statusFilter === filter.id 
                            ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/10">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">shopping_basket</span>
                    <h3 className="text-xl font-bold text-on-surface mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-on-surface-variant mb-6">Bạn chưa có đơn hàng nào trong mục này.</p>
                    <Link to="/products" className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110 active:scale-95 inline-block">
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((order) => {
                        const statusInfo = mapStatus(order.status);
                        const mainProduct = order.main_item?.product_id;
                        
                        return (
                            <div key={order._id} className="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-[0_20px_40px_rgba(26,28,29,0.04)] group border border-outline-variant/5">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${statusInfo.color.split(' ')[0]}`}>
                                        <span className={`material-symbols-outlined text-3xl ${statusInfo.color.split(' ')[1]}`}>{statusInfo.icon}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold tracking-widest text-primary uppercase">#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-on-surface truncate max-w-[250px] md:max-w-[400px]">
                                            {mainProduct?.name || `Đơn hàng #${order._id.slice(-6).toUpperCase()}`}
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end w-full md:w-auto border-t md:border-none pt-6 md:pt-0 gap-4">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-on-surface-variant font-medium uppercase tracking-tighter">Tổng thanh toán</p>
                                        <p className={`text-2xl font-black ${order.status === 'cancelled' ? 'text-on-surface-variant line-through opacity-50' : 'text-on-surface'}`}>
                                            {order.total_price.toLocaleString()}₫
                                        </p>
                                    </div>
                                    <Link 
                                        to={`/orders/${order._id}`} 
                                        className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Xem chi tiết
                                        <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                                    </Link>
                                    {order.status === 'pending' && (
                                        <button 
                                            onClick={() => handleCancelOrder(order._id)}
                                            className="text-red-600 hover:text-red-700 font-bold text-sm flex items-center justify-center gap-1 mt-1 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">cancel</span>
                                            Hủy đơn
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
};

export default OrderHistory;
