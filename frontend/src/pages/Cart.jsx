import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data.items);
            setLoading(false);
        } catch (_err) {
            setError('Không thể lấy thông tin giỏ hàng. Vui lòng đăng nhập.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.put(`/cart/${id}`, { quantity: newQuantity });
            fetchCart();
        } catch (_err) {
            alert('Cập nhật số lượng thất bại');
        }
    };

    const handleRemoveItem = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            try {
                await api.delete(`/cart/${id}`);
                fetchCart();
            } catch (_err) {
                alert('Xóa sản phẩm thất bại');
            }
        }
    };

    const handleCheckout = async () => {
        try {
            await api.post('/orders');
            alert('Đặt hàng thành công!');
            navigate('/orders'); // Giả sử chúng ta sẽ có trang đơn hàng
        } catch (err) {
            alert(err.response?.data?.message || 'Đặt hàng thất bại');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product_id.price * item.quantity), 0);
    };

    if (loading) return <p>Đang tải giỏ hàng...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Giỏ Hàng Của Bạn</h2>
            {cartItems.length === 0 ? (
                <p>Giỏ hàng trống. <button onClick={() => navigate('/products')}>Đi mua sắm ngay</button></p>
            ) : (
                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ccc' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Sản phẩm</th>
                                <th style={{ padding: '10px' }}>Giá</th>
                                <th style={{ padding: '10px' }}>Số lượng</th>
                                <th style={{ padding: '10px' }}>Tổng</th>
                                <th style={{ padding: '10px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                                        {item.product_id.images && item.product_id.images[0] && (
                                            <img src={item.product_id.images[0]} alt={item.product_id.name} style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} />
                                        )}
                                        {item.product_id.name}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '10px' }}>{item.product_id.price.toLocaleString()} VNĐ</td>
                                    <td style={{ textAlign: 'center', padding: '10px' }}>
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>-</button>
                                        <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '10px' }}>{(item.product_id.price * item.quantity).toLocaleString()} VNĐ</td>
                                    <td style={{ textAlign: 'center', padding: '10px' }}>
                                        <button onClick={() => handleRemoveItem(item._id)} style={{ color: 'red' }}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <p>Tổng cộng: {calculateTotal().toLocaleString()} VNĐ</p>
                        <button 
                            onClick={handleCheckout}
                            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Thanh Toán / Đặt Hàng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
