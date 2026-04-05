import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null);
    const [cancelling, setCancelling] = useState(false);

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

    const mapPaymentStatus = (status) => {
        const mapping = {
            pending: 'Chờ thanh toán',
            paid: 'Đã thanh toán',
            failed: 'Thanh toán thất bại'
        };
        return mapping[status] || status;
    };

    const mapPaymentMethod = (method) => {
        const mapping = {
            COD: 'Tiền mặt (COD)',
            BANK_TRANSFER: 'Chuyển khoản'
        };
        return mapping[method] || method;
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

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const handleCancelOrder = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
        setCancelling(true);
        try {
            await api.put(`/orders/${id}/cancel`);
            setNotice({ type: 'success', text: 'Đã hủy đơn hàng thành công' });
            // Refresh order
            const res = await api.get(`/orders/${id}`);
            setOrderData(res.data);
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Hủy đơn hàng thất bại' });
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return (
        <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-on-surface-variant font-medium">Đang tải chi tiết đơn hàng...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">{error}</h3>
                <button onClick={() => navigate('/orders')} className="text-primary font-bold hover:underline">Quay lại danh sách</button>
            </div>
        </div>
    );
    if (!orderData) return <p>Không tìm thấy đơn hàng</p>;

    const { order, items } = orderData;

    const steps = [
        { key: 'pending', label: 'Đặt hàng thành công', icon: 'check_circle' },
        { key: 'processing', label: 'Đang chuẩn bị', icon: 'inventory_2' },
        { key: 'shipped', label: 'Đang giao hàng', icon: 'local_shipping' },
        { key: 'delivered', label: 'Đã nhận hàng', icon: 'package_2' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-left">
            {/* Header & Breadcrumb */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-sm text-outline mb-4">
                    <Link className="hover:text-primary transition-colors" to="/profile">Tài khoản</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/orders">Lịch sử đơn hàng</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-on-surface font-medium">Chi tiết đơn hàng</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</h1>
                <p className="mt-2 text-outline">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                {notice && (
                    <div className={`mt-6 rounded-xl px-4 py-3 border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-lg">
                                {notice.type === 'success' ? 'check_circle' : notice.type === 'error' ? 'error' : 'info'}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold leading-snug">{notice.text}</p>
                            </div>
                            <button type="button" onClick={() => setNotice(null)} className="ml-auto text-on-surface-variant hover:opacity-80">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stepper Progress */}
            {!isCancelled && (
                <section className="mb-12 bg-surface-container-low rounded-xl p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex items-center justify-between">
                            {/* Line Background */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant rounded-full"></div>

                            {steps.map((step, index) => {
                                const isActive = index <= currentStepIndex;
                                return (
                                    <div key={step.key} className={`relative z-10 flex flex-col items-center ${isActive ? 'step-active' : 'step-pending'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-lg transition-all duration-500 ${isActive ? 'bg-primary text-white scale-110' : 'bg-surface-variant text-outline'}`}>
                                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}>{step.icon}</span>
                                        </div>
                                        <span className={`text-sm font-bold ${isActive ? 'text-on-surface' : 'text-outline'}`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {isCancelled && (
                <section className="mb-12 bg-red-50 rounded-xl p-8 border border-red-100 flex items-center gap-4">
                    <span className="material-symbols-outlined text-red-600 text-4xl">cancel</span>
                    <div>
                        <h3 className="text-xl font-bold text-red-800">Đơn hàng đã bị hủy</h3>
                        <p className="text-red-600">Đơn hàng này không còn hiệu lực.</p>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order History Timeline */}
                    {orderData.history && orderData.history.length > 0 && (
                        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/5">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h2 className="text-xl font-bold tracking-tight">Lịch sử thay đổi</h2>
                            </div>
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {orderData.history.map((log) => {
                                    const isOrder = log.status_type === 'order';
                                    return (
                                        <div key={log._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Icon Dot */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500">
                                                <span className="material-symbols-outlined text-sm">
                                                    {isOrder ? 'shopping_bag' : 'payments'}
                                                </span>
                                            </div>
                                            {/* Content Block */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 shadow-sm transition-all duration-300 hover:shadow-md">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-on-surface">
                                                        {isOrder ? 'Cập nhật trạng thái' : 'Thanh toán'}
                                                    </div>
                                                    <time className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                                                        {new Date(log.created_at).toLocaleDateString('vi-VN')} {new Date(log.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                                    </time>
                                                </div>
                                                <div className="text-sm text-on-surface-variant leading-relaxed">
                                                    <span className="font-bold">{mapStatus(log.new_value)}</span>
                                                    {log.note && <p className="mt-1 pb-1 text-xs italic opacity-80 border-t border-outline-variant/10 pt-1">{log.note}</p>}
                                                </div>
                                                <div className="mt-2 text-[10px] text-outline font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">person</span>
                                                    Bởi: {log.changed_by?.name || 'Hệ thống'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Shipping Info */}
                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/5">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <h2 className="text-xl font-bold tracking-tight">Thông tin nhận hàng</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Người nhận</p>
                                <p className="text-on-surface font-semibold text-lg">{order.user_id?.name || 'Khách hàng'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Email</p>
                                <p className="text-on-surface font-semibold text-lg">{order.user_id?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Số điện thoại</p>
                                <p className="text-on-surface font-semibold text-lg">{order.phone_number || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Địa chỉ</p>
                                <p className="text-on-surface leading-relaxed text-lg font-medium">{order.shipping_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/5">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-primary">shopping_bag</span>
                            <h2 className="text-xl font-bold tracking-tight">Sản phẩm trong đơn</h2>
                        </div>
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-surface-container last:border-0 last:pb-0">
                                    <div className="relative shrink-0 group">
                                        <img
                                            alt={item.product_id.name}
                                            className="w-32 h-32 object-contain bg-surface-container-low rounded-xl p-4 group-hover:scale-105 transition-transform duration-500"
                                            src={item.product_id.images?.[0] || 'https://via.placeholder.com/150'}
                                        />
                                    </div>
                                    <div className="flex-grow space-y-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-on-surface leading-tight">{item.product_id.name}</h3>
                                        <div className="flex justify-center sm:justify-start gap-4 text-sm text-outline">
                                            <span>Mã SP: {item.product_id._id?.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                                            <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-bold">Số lượng: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <p className="text-primary font-extrabold text-xl">{item.price.toLocaleString()}₫</p>
                                        <p className="text-xs text-outline font-medium tracking-tighter uppercase">Đơn giá</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex items-center gap-2 px-8 py-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Quay lại lịch sử
                        </button>
                        {!isCancelled && order.status === 'delivered' && (
                            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95">
                                <span className="material-symbols-outlined">star</span>
                                Đánh giá sản phẩm
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center gap-2 px-8 py-4 bg-surface-container-lowest border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Mua thêm sản phẩm
                        </button>
                        {!isCancelled && order.status === 'pending' && (
                            <button 
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex items-center gap-2 px-8 py-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-xl">cancel</span>
                                {cancelling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="space-y-8">
                    {/* Payment Summary */}
                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/5">
                        <h2 className="text-xl font-bold tracking-tight mb-6">Tóm tắt thanh toán</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-on-surface-variant font-medium">
                                <span>Tạm tính ({items.length} sản phẩm)</span>
                                <span>{order.total_price.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between text-on-surface-variant font-medium">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600 font-bold italic">Miễn phí</span>
                            </div>
                            <div className="pt-4 border-t border-surface-container-high">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">Tổng cộng</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-primary tracking-tighter">{order.total_price.toLocaleString()}₫</p>
                                        <p className="text-xs text-outline italic mt-1">(Đã bao gồm VAT)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/5">
                        <h2 className="text-xl font-bold tracking-tight mb-6">Thanh toán</h2>
                        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-primary text-3xl">
                                    {order.payment_method === 'COD' ? 'payments' : 'account_balance'}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-on-surface leading-tight">{mapPaymentMethod(order.payment_method)}</p>
                                <p className="text-sm text-outline font-medium">{mapPaymentStatus(order.payment_status)}</p>
                            </div>
                        </div>
                        {order.payment_status === 'paid' && (
                            <div className="mt-6 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-4 rounded-xl font-bold border border-green-100">
                                <span className="material-symbols-outlined text-lg">verified</span>
                                <span>Đã thanh toán an toàn</span>
                            </div>
                        )}
                        {order.payment_status === 'pending' && (
                            <div className="mt-6 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-4 rounded-xl font-bold border border-amber-100">
                                <span className="material-symbols-outlined text-lg">schedule</span>
                                <span>Đang chờ xác nhận thanh toán</span>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </main>
    );
};

export default OrderDetail;
