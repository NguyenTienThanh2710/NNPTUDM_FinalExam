import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
    if (error) return <div className="error-state">{error}</div>;
    if (!orderData) return <p>Không tìm thấy đơn hàng</p>;

    const { order, items } = orderData;

    return (
        <main>
            <section className="section-block">
                <button className="back-button text-link" onClick={() => navigate('/orders')}>← Quay lại danh sách</button>
                <div className="detail-shell" style={{ marginTop: '16px' }}>
                    <div className="section-heading" style={{ marginBottom: '16px' }}>
                        <div>
                            <span className="eyebrow">Chi tiết đơn hàng</span>
                            <h2>Chi Tiết Đơn Hàng</h2>
                        </div>
                    </div>
                    <div className="meta-grid" style={{ marginTop: 0 }}>
                        <div className="meta-box"><div className="meta-label">Mã đơn hàng</div><strong>{order._id}</strong></div>
                        <div className="meta-box"><div className="meta-label">Ngày đặt</div><strong>{new Date(order.created_at).toLocaleString()}</strong></div>
                        <div className="meta-box"><div className="meta-label">Trạng thái</div><strong>{mapStatus(order.status)}</strong></div>
                    </div>
                    <p className="detail-price" style={{ marginTop: '6px' }}>{order.total_price.toLocaleString()} VNĐ</p>
                </div>

                <div className="table-shell" style={{ marginTop: '18px' }}>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id} className="order-row">
                                    <td>
                                        <div className="row-product">
                                            {item.product_id.images && item.product_id.images[0] && (
                                                <img src={item.product_id.images[0]} alt={item.product_id.name} />
                                            )}
                                            <strong>{item.product_id.name}</strong>
                                        </div>
                                    </td>
                                    <td>{item.price.toLocaleString()} VNĐ</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default OrderDetail;
