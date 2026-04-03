import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

/* ─── Config ───────────────────────────────────────────── */
const ORDER_STATUSES = [
    { value: 'pending',    label: 'Chờ xử lý',      color: 'text-amber-600',  bg: 'bg-amber-50',  icon: 'schedule' },
    { value: 'processing', label: 'Đang xử lý',      color: 'text-blue-600',   bg: 'bg-blue-50',   icon: 'autorenew' },
    { value: 'shipped',    label: 'Đang giao hàng',  color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'local_shipping' },
    { value: 'delivered',  label: 'Đã giao hàng',    color: 'text-green-600',  bg: 'bg-green-50',  icon: 'check_circle' },
    { value: 'cancelled',  label: 'Đã hủy',          color: 'text-red-600',    bg: 'bg-red-50',    icon: 'cancel' },
];

const PAYMENT_STATUSES = [
    { value: 'pending', label: 'Chờ thanh toán', color: 'text-amber-600', bg: 'bg-amber-50',  icon: 'hourglass_empty' },
    { value: 'paid',    label: 'Đã thanh toán',  color: 'text-green-600', bg: 'bg-green-50',  icon: 'check_circle' },
    { value: 'failed',  label: 'Thất bại',        color: 'text-red-600',   bg: 'bg-red-50',    icon: 'cancel' },
];

const PAYMENT_METHOD_LABELS = {
    cod:          { label: 'Tiền mặt khi nhận hàng (COD)', icon: 'payments' },
    bank_transfer:{ label: 'Chuyển khoản ngân hàng',       icon: 'account_balance' },
    momo:         { label: 'Ví điện tử MoMo/ZaloPay',      icon: 'account_balance_wallet' },
};

/* ─── Helpers ──────────────────────────────────────────── */
const getStatusCfg = (arr, value) => arr.find(s => s.value === value) || arr[0];

const StatusBadge = ({ cfg }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color}`}>
        <span className="material-symbols-outlined text-sm">{cfg.icon}</span>
        {cfg.label}
    </span>
);

/* ─── Timeline step ────────────────────────────────────── */
const TIMELINE_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

const OrderTimeline = ({ currentStatus }) => {
    const isCancelled = currentStatus === 'cancelled';
    const activeIdx   = TIMELINE_ORDER.indexOf(currentStatus);

    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
                <div>
                    <p className="font-bold text-red-700">Đơn hàng đã bị hủy</p>
                    <p className="text-xs text-red-500 mt-0.5">Đơn hàng này không được xử lý tiếp.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {TIMELINE_ORDER.map((step, idx) => {
                const cfg     = getStatusCfg(ORDER_STATUSES, step);
                const done    = idx <= activeIdx;
                const current = idx === activeIdx;
                return (
                    <React.Fragment key={step}>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${current ? `${cfg.bg} ${cfg.color} font-bold` : done ? 'bg-green-50 text-green-600 font-semibold' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="material-symbols-outlined text-base">{done ? (current ? cfg.icon : 'check_circle') : cfg.icon}</span>
                            <span className="text-xs whitespace-nowrap">{cfg.label}</span>
                        </div>
                        {idx < TIMELINE_ORDER.length - 1 && (
                            <span className={`material-symbols-outlined text-lg mx-0 sm:mx-1 ${done && idx < activeIdx ? 'text-green-400' : 'text-slate-300'}`}>chevron_right</span>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/* ─── Main Component ───────────────────────────────────── */
const AdminOrderDetail = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();

    const [order,   setOrder]   = useState(null);
    const [items,   setItems]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    // Update states
    const [updatingStatus,  setUpdatingStatus]  = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);
    const [successMsg,      setSuccessMsg]      = useState('');

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

    useEffect(() => { if (id) fetchOrder(); }, [id]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleUpdateStatus = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            setOrder(prev => ({ ...prev, status: newStatus }));
            showSuccess(`Đã cập nhật trạng thái đơn hàng: ${getStatusCfg(ORDER_STATUSES, newStatus).label}`);
        } catch {
            setError('Cập nhật trạng thái thất bại.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleUpdatePayment = async (newStatus) => {
        setUpdatingPayment(true);
        try {
            await api.put(`/orders/${id}/payment`, { payment_status: newStatus });
            setOrder(prev => ({ ...prev, payment_status: newStatus }));
            showSuccess(`Đã cập nhật trạng thái thanh toán: ${getStatusCfg(PAYMENT_STATUSES, newStatus).label}`);
        } catch {
            setError('Cập nhật thanh toán thất bại.');
        } finally {
            setUpdatingPayment(false);
        }
    };

    /* ── Loading / Error ── */
    if (loading) return (
        <AdminLayout title="Chi tiết đơn hàng">
            <div className="flex items-center justify-center h-64 gap-3 text-secondary">
                <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                <span className="font-medium">Đang tải đơn hàng...</span>
            </div>
        </AdminLayout>
    );

    if (error && !order) return (
        <AdminLayout title="Chi tiết đơn hàng">
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <span className="material-symbols-outlined text-5xl text-red-400">error</span>
                <p className="text-red-600 font-medium">{error}</p>
                <button onClick={() => navigate('/admin/orders')} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold">
                    Quay lại danh sách
                </button>
            </div>
        </AdminLayout>
    );

    const orderStatusCfg  = getStatusCfg(ORDER_STATUSES,   order.status);
    const paymentStatusCfg = getStatusCfg(PAYMENT_STATUSES, order.payment_status);
    const paymentMethodCfg = PAYMENT_METHOD_LABELS[order.payment_method] || { label: order.payment_method, icon: 'payments' };

    return (
        <AdminLayout
            title="Chi Tiết Đơn Hàng"
            subtitle={`Mã đơn: #${order._id.slice(-10).toUpperCase()}`}
            actions={
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-sm hover:opacity-80 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Quay lại danh sách
                </button>
            }
        >
            {/* ── Toast ── */}
            {successMsg && (
                <div className="fixed top-20 right-6 z-50 animate-bounce-in flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left">

                {/* ── LEFT (2/3) ── */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Trạng Thái Đơn Hàng</h2>
                        <OrderTimeline currentStatus={order.status} />
                    </div>

                    {/* Products */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-on-surface">Sản Phẩm ({items.length})</h2>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {items.map(item => (
                                <div key={item._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                        {item.product_id?.images?.[0] ? (
                                            <img src={item.product_id.images[0]} alt={item.product_id.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-slate-400">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-on-surface line-clamp-1">{item.product_id?.name || 'Sản phẩm đã xóa'}</p>
                                        <p className="text-sm text-secondary mt-0.5">{item.price?.toLocaleString()} ₫ / sản phẩm</p>
                                    </div>
                                    <div className="text-center flex-shrink-0">
                                        <p className="text-xs text-secondary">Số lượng</p>
                                        <p className="font-bold text-on-surface">{item.quantity}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-secondary">Thành tiền</p>
                                        <p className="font-bold text-primary">{(item.price * item.quantity).toLocaleString()} ₫</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Totals */}
                        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between text-sm text-secondary">
                                <span>Tạm tính</span>
                                <span>{order.total_price.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-secondary">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600 font-semibold">Miễn phí</span>
                            </div>
                            <div className="flex justify-between text-base font-black pt-2 border-t border-slate-200">
                                <span>Tổng cộng</span>
                                <span className="text-primary text-lg">{order.total_price.toLocaleString()} ₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Recipient Info */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h2 className="font-bold text-on-surface">Thông Tin Giao Hàng</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <InfoRow icon="person" label="Người nhận" value={order.recipient_name || '—'} />
                            <InfoRow icon="phone" label="Số điện thoại" value={order.recipient_phone || '—'} />
                            <InfoRow icon="mail" label="Email" value={order.recipient_email || '—'} />
                            <InfoRow icon="calendar_today" label="Ngày đặt hàng" value={new Date(order.created_at).toLocaleString('vi-VN')} />
                            <div className="sm:col-span-2">
                                <InfoRow icon="location_on" label="Địa chỉ giao hàng" value={order.shipping_address || '—'} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT (1/3) ── */}
                <div className="space-y-6">

                    {/* Order Status Control */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-on-surface">Trạng Thái Đơn</h2>
                            <StatusBadge cfg={orderStatusCfg} />
                        </div>
                        <div className="p-5 space-y-2">
                            <p className="text-xs text-secondary font-semibold uppercase tracking-widest mb-3">Cập nhật trạng thái</p>
                            {ORDER_STATUSES.map(s => (
                                <button
                                    key={s.value}
                                    disabled={updatingStatus || order.status === s.value}
                                    onClick={() => handleUpdateStatus(s.value)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        order.status === s.value
                                            ? `${s.bg} ${s.color} ring-2 ring-current/30 cursor-default`
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-base ${order.status === s.value ? s.color : 'text-slate-400'}`}>{s.icon}</span>
                                    <span>{s.label}</span>
                                    {order.status === s.value && <span className="ml-auto material-symbols-outlined text-sm">check</span>}
                                </button>
                            ))}
                            {updatingStatus && (
                                <div className="flex items-center justify-center gap-2 text-xs text-secondary mt-2">
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                    Đang cập nhật...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Status Control */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-on-surface">Thanh Toán</h2>
                            <StatusBadge cfg={paymentStatusCfg} />
                        </div>
                        <div className="p-5 space-y-3">
                            {/* Payment method */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <span className="material-symbols-outlined text-slate-500 text-xl">{paymentMethodCfg.icon}</span>
                                <div>
                                    <p className="text-xs text-secondary">Phương thức</p>
                                    <p className="text-sm font-semibold text-on-surface">{paymentMethodCfg.label}</p>
                                </div>
                            </div>

                            <p className="text-xs text-secondary font-semibold uppercase tracking-widest mt-2">Cập nhật trạng thái TT</p>
                            {PAYMENT_STATUSES.map(s => (
                                <button
                                    key={s.value}
                                    disabled={updatingPayment || order.payment_status === s.value}
                                    onClick={() => handleUpdatePayment(s.value)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        order.payment_status === s.value
                                            ? `${s.bg} ${s.color} ring-2 ring-current/30 cursor-default`
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-base ${order.payment_status === s.value ? s.color : 'text-slate-400'}`}>{s.icon}</span>
                                    <span>{s.label}</span>
                                    {order.payment_status === s.value && <span className="ml-auto material-symbols-outlined text-sm">check</span>}
                                </button>
                            ))}
                            {updatingPayment && (
                                <div className="flex items-center justify-center gap-2 text-xs text-secondary mt-2">
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                    Đang cập nhật...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h2 className="font-bold text-on-surface mb-1">Tóm Tắt</h2>
                        <QuickRow label="Mã đơn" value={`#${order._id.slice(-10).toUpperCase()}`} mono />
                        <QuickRow label="Số sản phẩm" value={`${items.length} mặt hàng`} />
                        <QuickRow label="Tổng tiền" value={`${order.total_price.toLocaleString()} ₫`} highlight />
                        <QuickRow label="Tạo lúc" value={new Date(order.created_at).toLocaleString('vi-VN')} />
                    </div>

                    {/* Danger Zone */}
                    {order.status !== 'cancelled' && (
                        <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
                            <h3 className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">warning</span>
                                Vùng nguy hiểm
                            </h3>
                            <p className="text-xs text-red-500 mb-3">Hành động này không thể hoàn tác.</p>
                            <button
                                disabled={updatingStatus}
                                onClick={() => {
                                    if (window.confirm('Bạn có chắc chắn muốn HỦY đơn hàng này không?')) {
                                        handleUpdateStatus('cancelled');
                                    }
                                }}
                                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                            >
                                Hủy Đơn Hàng
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

/* ─── Sub-components ───────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-slate-500 text-base">{icon}</span>
        </div>
        <div>
            <p className="text-xs text-secondary font-semibold">{label}</p>
            <p className="text-sm font-semibold text-on-surface mt-0.5">{value}</p>
        </div>
    </div>
);

const QuickRow = ({ label, value, mono, highlight }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-xs text-secondary">{label}</span>
        <span className={`text-sm font-bold ${highlight ? 'text-primary' : 'text-on-surface'} ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
);

export default AdminOrderDetail;
