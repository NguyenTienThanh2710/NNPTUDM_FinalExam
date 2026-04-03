import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const PAYMENT_METHOD_LABELS = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    bank_transfer: 'Chuyển khoản ngân hàng',
};

const PAYMENT_STATUS_CONFIG = {
    pending: { label: 'Chờ thanh toán', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'schedule' },
    paid:    { label: 'Đã thanh toán',  color: 'text-green-600', bg: 'bg-green-50',  icon: 'check_circle' },
    failed:  { label: 'Thanh toán thất bại', color: 'text-red-600', bg: 'bg-red-50', icon: 'cancel' },
};

const ORDER_STATUS_LABELS = {
    pending:    'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped:    'Đang giao hàng',
    delivered:  'Đã giao hàng',
    cancelled:  'Đã hủy',
};

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.order);
                setItems(res.data.items || []);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng.');
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
                    <p className="font-medium">Đang tải đơn hàng...</p>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <span className="material-symbols-outlined text-6xl text-red-400 mb-4 block">error</span>
                    <h2 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
                    <p className="text-secondary mb-6">{error}</p>
                    <Link to="/orders" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all">
                        Xem lịch sử đơn hàng
                    </Link>
                </div>
            </main>
        );
    }

    const paymentStatusCfg = PAYMENT_STATUS_CONFIG[order.payment_status] || PAYMENT_STATUS_CONFIG.pending;
    const isCOD = order.payment_method === 'cod';

    return (
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 min-h-screen text-left">

            {/* ── Success Banner ─────────────────────────────── */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5">
                    <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Đặt Hàng Thành Công!</h1>
                <p className="text-secondary">
                    Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất có thể.
                </p>
            </div>

            {/* ── Order Info Card ──────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">

                {/* Header row */}
                <div className="px-7 py-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest">Mã đơn hàng</p>
                        <p className="font-mono font-bold text-primary mt-0.5">#{order._id.slice(-10).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest">Ngày đặt</p>
                        <p className="font-semibold text-sm mt-0.5">
                            {new Date(order.created_at).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                {/* Detail rows */}
                <div className="divide-y divide-slate-50">

                    {/* Recipient */}
                    <div className="px-7 py-5 flex items-start gap-4">
                        <span className="material-symbols-outlined text-secondary text-xl mt-0.5">person</span>
                        <div>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Người nhận</p>
                            <p className="font-semibold">{order.recipient_name || 'Chưa cập nhật'}</p>
                            <p className="text-secondary text-sm">{order.recipient_phone || ''}</p>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="px-7 py-5 flex items-start gap-4">
                        <span className="material-symbols-outlined text-secondary text-xl mt-0.5">local_shipping</span>
                        <div>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Địa chỉ giao hàng</p>
                            <p className="font-semibold">{order.shipping_address || 'Chưa cập nhật'}</p>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className="px-7 py-5 flex items-start gap-4">
                        <span className="material-symbols-outlined text-secondary text-xl mt-0.5">payments</span>
                        <div>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Phương thức thanh toán</p>
                            <p className="font-semibold">{PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}</p>
                        </div>
                    </div>

                    {/* Payment status */}
                    <div className="px-7 py-5 flex items-start gap-4">
                        <span className={`material-symbols-outlined text-xl mt-0.5 ${paymentStatusCfg.color}`}>
                            {paymentStatusCfg.icon}
                        </span>
                        <div>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Trạng thái thanh toán</p>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${paymentStatusCfg.bg} ${paymentStatusCfg.color}`}>
                                {paymentStatusCfg.label}
                            </span>
                        </div>
                    </div>

                    {/* Order status */}
                    <div className="px-7 py-5 flex items-start gap-4">
                        <span className="material-symbols-outlined text-secondary text-xl mt-0.5">inventory_2</span>
                        <div>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Trạng thái đơn hàng</p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                                {ORDER_STATUS_LABELS[order.status] || order.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── COD info note ─────────────────────────────── */}
            {isCOD && (
                <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                    <span className="material-symbols-outlined text-amber-500 text-2xl mt-0.5">info</span>
                    <div>
                        <p className="font-bold text-amber-800 mb-1">Thanh toán khi nhận hàng</p>
                        <p className="text-sm text-amber-700">
                            Vui lòng chuẩn bị <strong>{order.total_price.toLocaleString()} ₫</strong> để thanh toán khi nhân viên giao hàng đến. Đơn hàng sẽ được giao trong 2-5 ngày làm việc.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Ordered Items ─────────────────────────────── */}
            {items.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                    <div className="px-7 py-5 border-b border-slate-100">
                        <h2 className="font-bold">Sản Phẩm Đã Đặt</h2>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {items.map(item => (
                            <div key={item._id} className="px-7 py-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                    {item.product_id?.images?.[0] ? (
                                        <img src={item.product_id.images[0]} alt={item.product_id.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-400 text-sm">image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold line-clamp-1">{item.product_id?.name || 'Sản phẩm'}</p>
                                    <p className="text-xs text-secondary">Số lượng: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold flex-shrink-0">
                                    {(item.price * item.quantity).toLocaleString()} ₫
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="px-7 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-bold">Tổng cộng</span>
                        <span className="text-xl font-black text-primary">{order.total_price.toLocaleString()} ₫</span>
                    </div>
                </div>
            )}

            {/* ── Actions ─────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/orders"
                    className="flex-1 py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary hover:text-white transition-all"
                >
                    Xem Lịch Sử Đơn Hàng
                </Link>
                <Link
                    to="/products"
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white font-bold text-center shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                >
                    Tiếp Tục Mua Sắm
                </Link>
            </div>
        </main>
    );
};

export default OrderSuccess;
