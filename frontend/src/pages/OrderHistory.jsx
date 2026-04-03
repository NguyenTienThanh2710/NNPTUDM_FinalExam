import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        </main>
    );
};

export default OrderHistory;
