import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const mapStatus = (status) => {
        const mapping = {
            pending: 'Chờ xử lý',
            processing: 'Đang xử lý',
            shipped: 'Đang giao',
            delivered: 'Đã giao',
            cancelled: 'Đã huỷ'
        };
        return mapping[status] || status;
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

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <main>
            <section className="section-block">
                {notice && (
                    <div className={`mb-6 rounded-xl px-4 py-3 border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
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
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">Đơn hàng</span>
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
                                    {mapStatus(order.status)}
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
        </main>
    );
};

export default OrderHistory;
