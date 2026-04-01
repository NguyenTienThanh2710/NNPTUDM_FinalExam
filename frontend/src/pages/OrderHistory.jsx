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
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lịch Sử Đơn Hàng</h2>
            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                            <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>
                            <p><strong>Tổng tiền:</strong> {order.total_price.toLocaleString()} VNĐ</p>
                            <p><strong>Trạng thái:</strong> <span style={{ color: order.status === 'delivered' ? 'green' : 'orange' }}>{order.status}</span></p>
                            <Link to={`/orders/${order._id}`}>Xem chi tiết</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
