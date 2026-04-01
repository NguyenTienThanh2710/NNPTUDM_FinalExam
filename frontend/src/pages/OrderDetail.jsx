import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrderData(res.data);
                setLoading(false);
            } catch (_err) {
                setError('Không thể lấy chi tiết đơn hàng');
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

    if (loading) return <p>Đang tải chi tiết đơn hàng...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!orderData) return <p>Không tìm thấy đơn hàng</p>;

    const { order, items } = orderData;

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/orders')}>Quay lại danh sách</button>
            <h2>Chi Tiết Đơn Hàng</h2>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                <p><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Trạng thái:</strong> <span style={{ color: order.status === 'delivered' ? 'green' : 'orange' }}>{order.status}</span></p>
                <p><strong>Tổng tiền:</strong> {order.total_price.toLocaleString()} VNĐ</p>
            </div>

            <h3>Sản phẩm trong đơn hàng:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Sản phẩm</th>
                        <th style={{ padding: '10px' }}>Giá</th>
                        <th style={{ padding: '10px' }}>Số lượng</th>
                        <th style={{ padding: '10px' }}>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                                {item.product_id.images && item.product_id.images[0] && (
                                    <img src={item.product_id.images[0]} alt={item.product_id.name} style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} />
                                )}
                                {item.product_id.name}
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>{item.price.toLocaleString()} VNĐ</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDetail;
