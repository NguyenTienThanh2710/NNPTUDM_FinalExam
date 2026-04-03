import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate, Link } from 'react-router-dom';
=======
import { useParams, useNavigate } from 'react-router-dom';
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
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
<<<<<<< HEAD
                setError('Không thể lấy chi tiết đơn hàng. Vui lòng thử lại sau.');
=======
                setError('Không thể lấy chi tiết đơn hàng');
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

<<<<<<< HEAD
    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-surface">
                <div className="flex flex-col items-center gap-3 text-outline">
                    <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
                    <p className="font-bold text-sm uppercase tracking-widest text-primary">Đang tải chi tiết...</p>
                </div>
            </main>
        );
    }

    if (error || !orderData) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-surface p-6">
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex flex-col items-center gap-4 text-red-700 animate-fade-in shadow-sm max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-5xl">error</span>
                    <h2 className="text-xl font-black uppercase tracking-tight">Lỗi truy xuất</h2>
                    <p className="font-medium text-slate-500">{error || 'Không tìm thấy đơn hàng này.'}</p>
                    <button onClick={() => navigate('/orders')} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">Quay lại danh sách</button>
                </div>
            </main>
        );
    }

    const { order, items } = orderData;

    // Stepper logic
    const steps = [
        { id: 1, label: 'Đặt hàng thành công', icon: 'check_circle', active: true },
        { id: 2, label: 'Đang chuẩn bị', icon: 'inventory_2', active: ['processing', 'shipped', 'delivered'].includes(order.status) },
        { id: 3, label: 'Đang giao hàng', icon: 'local_shipping', active: ['shipped', 'delivered'].includes(order.status) },
        { id: 4, label: 'Đã nhận hàng', icon: 'package_2', active: order.status === 'delivered' }
    ];

    return (
        <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto font-body text-on-surface antialiased bg-surface text-left">
            {/* Header & Breadcrumb */}
            <div className="mb-10">
                <nav className="flex items-center gap-2 text-sm text-outline mb-4">
                    <Link className="hover:text-primary transition-colors flex items-center" to="/">Tài khoản</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <Link className="hover:text-primary transition-colors flex items-center" to="/orders">Lịch sử đơn hàng</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-on-surface font-black">Chi tiết đơn hàng</span>
                </nav>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface">Chi tiết đơn hàng #{order._id.slice(-8).toUpperCase()}</h1>
                <p className="mt-2 text-outline font-medium">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' })}</p>
            </div>

            {/* Stepper Progress */}
            <section className="mb-12 bg-surface-container-low rounded-[32px] p-8 md:p-12 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex items-center justify-between">
                        {/* Line Background */}
                        <div className="absolute left-0 top-5 w-full h-1 bg-surface-variant rounded-full"></div>
                        
                        {steps.map((step) => (
                            <div key={step.id} className={`relative z-10 flex flex-col items-center flex-1`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-lg transition-all duration-500 scale-100 hover:scale-110 ${step.active ? 'bg-primary text-on-primary' : 'bg-surface-variant text-outline'}`}>
                                    <span className="material-symbols-outlined text-xl" style={step.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                        {step.icon}
                                    </span>
                                </div>
                                <span className={`text-[10px] md:text-sm font-black uppercase tracking-tight text-center ${step.active ? 'text-on-surface' : 'text-outline-variant'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Shipping Info */}
                    <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-slate-50">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black">
                                <span className="material-symbols-outlined">location_on</span>
                            </span>
                            <h2 className="text-2xl font-black tracking-tight uppercase">Thông tin nhận hàng</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-outline-variant uppercase tracking-widest mb-1">Người nhận</p>
                                <p className="text-on-surface font-black text-xl">{order.recipient_name || 'Khách hàng'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-outline-variant uppercase tracking-widest mb-1">Số điện thoại</p>
                                <p className="text-on-surface font-black text-xl">{order.recipient_phone || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-[10px] font-black text-outline-variant uppercase tracking-widest mb-1">Địa chỉ</p>
                                <p className="text-on-surface-variant font-medium leading-relaxed max-w-2xl">{order.shipping_address || 'Địa chỉ đang bộ dữ liệu...'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-slate-50">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black">
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </span>
                            <h2 className="text-2xl font-black tracking-tight uppercase">Sản phẩm trong đơn</h2>
                        </div>
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-surface-container last:border-0 last:pb-0 group">
                                    <div className="relative shrink-0 overflow-hidden rounded-2xl bg-surface-container-low p-4 transition-transform duration-500 group-hover:scale-105">
                                        <img 
                                            alt={item.product_id.name} 
                                            className="w-32 h-32 object-contain" 
                                            src={item.product_id.images?.[0] || 'https://via.placeholder.com/150'} 
                                        />
                                    </div>
                                    <div className="flex-grow space-y-2 text-center sm:text-left">
                                        <h3 className="text-xl font-black text-on-surface leading-tight transition-colors group-hover:text-primary">{item.product_id.name}</h3>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                            <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-black uppercase text-on-surface-variant opacity-70">SL: {item.quantity}</span>
                                            <span className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black uppercase text-primary">Giá lẻ: {item.price.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <p className="text-primary font-black text-2xl tracking-tighter">{(item.price * item.quantity).toLocaleString()}₫</p>
                                        <p className="text-[10px] font-bold text-outline-variant italic">Thành tiền</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="flex items-center gap-3 px-8 py-4 bg-surface-container-high hover:bg-slate-200 text-on-surface-variant font-black rounded-2xl transition-all active:scale-95 group"
                        >
                            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Quay lại lịch sử
                        </button>
                        {order.status === 'delivered' && (
                            <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:brightness-110 active:scale-95">
                                <span className="material-symbols-outlined">star</span>
                                Đánh giá sản phẩm
                            </button>
                        )}
                        {(['delivered', 'cancelled'].includes(order.status)) && (
                            <button 
                                onClick={() => navigate('/products')}
                                className="flex items-center gap-3 px-8 py-4 bg-surface-container-lowest border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary/5 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined">refresh</span>
                                Mua lại
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="space-y-10">
                    {/* Payment Summary */}
                    <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-slate-50">
                        <h2 className="text-2xl font-black tracking-tight mb-8 uppercase">Tóm tắt thanh toán</h2>
                        <div className="space-y-5">
                            <div className="flex justify-between text-on-surface-variant font-bold">
                                <span>Tạm tính ({items.length} sản phẩm)</span>
                                <span className="text-on-surface">{order.total_price.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between text-on-surface-variant font-bold">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600">Miễn phí</span>
                            </div>
                            <div className="flex justify-between text-tertiary font-bold">
                                <span>Giảm giá khuyến mãi</span>
                                <span>-0₫</span>
                            </div>
                            <div className="pt-6 border-t-2 border-dashed border-surface-variant">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-black uppercase text-outline-variant">Tổng cộng</span>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-primary tracking-tighter leading-none">{order.total_price.toLocaleString()}₫</p>
                                        <p className="text-[10px] text-outline italics mt-1">(Đã bao gồm VAT 10%)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Details */}
                    <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-slate-50">
                        <h2 className="text-2xl font-black tracking-tight mb-8 uppercase">Thanh toán</h2>
                        <div className="flex items-center gap-4 bg-surface-container-low p-5 rounded-2xl">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-primary text-3xl">
                                    {order.payment_method === 'cod' ? 'payments' : 'credit_card'}
                                </span>
                            </div>
                            <div>
                                <p className="font-black text-on-surface uppercase text-sm tracking-tight">
                                    {order.payment_method === 'cod' ? 'Thanh toán COD' : order.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán Online'}
                                </p>
                                <p className="text-xs font-bold text-outline uppercase">{order.payment_status === 'paid' ? 'Đã xác nhận' : 'Đang xử lý'}</p>
                            </div>
                        </div>
                        <div className={`mt-6 flex items-center gap-3 text-xs font-black p-4 rounded-xl border ${order.payment_status === 'paid' ? 'text-green-700 bg-green-50 border-green-100' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                            <span className="material-symbols-outlined text-sm">
                                {order.payment_status === 'paid' ? 'verified' : 'hourglass_empty'}
                            </span>
                            <span className="uppercase tracking-tight">
                                {order.payment_status === 'paid' ? 'Đã thanh toán qua Lumina Pay' : 'Vui lòng chuẩn bị tiền mặt khi nhận hàng'}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
=======
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
                            <span className="eyebrow">Order detail</span>
                            <h2>Chi Tiết Đơn Hàng</h2>
                        </div>
                    </div>
                    <div className="meta-grid" style={{ marginTop: 0 }}>
                        <div className="meta-box"><div className="meta-label">Mã đơn hàng</div><strong>{order._id}</strong></div>
                        <div className="meta-box"><div className="meta-label">Ngày đặt</div><strong>{new Date(order.created_at).toLocaleString()}</strong></div>
                        <div className="meta-box"><div className="meta-label">Trạng thái</div><strong>{order.status}</strong></div>
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
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        </main>
    );
};

export default OrderDetail;
