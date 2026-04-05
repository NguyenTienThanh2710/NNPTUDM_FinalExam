import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getImageURL } from '../utils/imageUtils';

const statusStyles = (status) => {
    switch (status) {
        case 'pending':
            return {
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                dot: 'bg-amber-500 animate-pulse',
                icon: null
            };
        case 'processing':
        case 'shipped':
            return {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                dot: 'bg-blue-500',
                icon: null
            };
        case 'delivered':
            return {
                bg: 'bg-green-50',
                text: 'text-green-700',
                dot: null,
                icon: 'check_circle'
            };
        case 'cancelled':
            return {
                bg: 'bg-red-50',
                text: 'text-red-700',
                dot: null,
                icon: 'cancel'
            };
        default:
            return {
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                dot: 'bg-slate-500',
                icon: null
            };
    }
};

const getAvatarColor = (name) => {
    const colors = ['bg-primary-fixed text-primary', 'bg-slate-200 text-slate-600', 'bg-emerald-100 text-emerald-700', 'bg-slate-100 text-slate-400'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [detailOrderId, setDetailOrderId] = useState(null);
    const [statusDraft, setStatusDraft] = useState('pending');
    const [statusSaving, setStatusSaving] = useState(false);
    const [paymentStatusDraft, setPaymentStatusDraft] = useState('pending');
    const [paymentStatusSaving, setPaymentStatusSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const pageSize = 10;

    useEffect(() => {
        api.get('/orders/all').then(res => setOrders(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const getStatusText = (status) => {
        const map = { pending: 'Chờ xử lý', processing: 'Đang xử lý', shipped: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
        return map[status] || status;
    };

    const openDetail = async (orderId) => {
        setDetailOpen(true);
        setDetailOrderId(orderId);
        setDetailLoading(true);
        setDetailData(null);
        try {
            const res = await api.get(`/orders/${orderId}`);
            setDetailData(res.data);
            setStatusDraft(res.data?.order?.status || 'pending');
            setPaymentStatusDraft(res.data?.order?.payment_status || 'pending');
        } catch (_err) {
            const msg = _err?.response?.data?.message || _err?.response?.data?.msg || 'Không thể lấy chi tiết đơn hàng';
            setNotice({ type: 'error', text: msg });
            setDetailOpen(false);
            setDetailOrderId(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setDetailOpen(false);
        setDetailOrderId(null);
        setDetailData(null);
        setDetailLoading(false);
        setStatusSaving(false);
        setPaymentStatusSaving(false);
    };

    const saveStatus = async () => {
        if (!detailOrderId) return;
        if (!detailData?.order) return;
        if (statusDraft === detailData.order.status) return;
        setStatusSaving(true);
        try {
            const res = await api.put(`/orders/${detailOrderId}/status`, { status: statusDraft });
            const nextStatus = res.data?.status;
            setOrders((prev) => prev.map((o) => (o._id === detailOrderId ? { ...o, status: nextStatus } : o)));
            setDetailData((prev) => (prev ? { ...prev, order: { ...prev.order, status: nextStatus } } : prev));
            setNotice({ type: 'success', text: 'Cập nhật trạng thái đơn hàng thành công' });
        } catch (_err) {
            const msg = _err?.response?.data?.message || _err?.response?.data?.msg || 'Không thể cập nhật trạng thái đơn hàng';
            setNotice({ type: 'error', text: msg });
        } finally {
            setStatusSaving(false);
        }
    };

    const savePaymentStatus = async () => {
        if (!detailOrderId) return;
        if (!detailData?.order) return;
        if (paymentStatusDraft === detailData.order.payment_status) return;
        setPaymentStatusSaving(true);
        try {
            const res = await api.put(`/orders/${detailOrderId}/payment`, { payment_status: paymentStatusDraft });
            const nextStatus = res.data?.payment_status;
            setOrders((prev) => prev.map((o) => (o._id === detailOrderId ? { ...o, payment_status: nextStatus } : o)));
            setDetailData((prev) => (prev ? { ...prev, order: { ...prev.order, payment_status: nextStatus } } : prev));
            setNotice({ type: 'success', text: 'Cập nhật trạng thái thanh toán thành công' });
        } catch (_err) {
            const msg = _err?.response?.data?.message || _err?.response?.data?.msg || 'Không thể cập nhật trạng thái thanh toán';
            setNotice({ type: 'error', text: msg });
        } finally {
            setPaymentStatusSaving(false);
        }
    };

    const handleExportReport = (type = 'txt') => {
        if (!orders.length) return;
        const timestamp = new Date().toLocaleString('vi-VN');
        const filename = `Bao_cao_don_hang_${new Date().getTime()}`;

        if (type === 'pdf') {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('DANH SÁCH ĐƠN HÀNG', 105, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Ngày xuất: ${timestamp}`, 105, 22, { align: 'center' });

            const data = orders.map((o, i) => [
                i + 1,
                o._id.toUpperCase(),
                o.user_id?.name || 'N/A',
                new Date(o.created_at).toLocaleDateString('vi-VN'),
                `${o.total_price?.toLocaleString()} ₫`,
                getStatusText(o.status)
            ]);

            doc.autoTable({
                startY: 30,
                head: [['STT', 'Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái']],
                body: data,
                headStyles: { fillColor: [0, 62, 199] }
            });

            doc.save(`${filename}.pdf`);
            return;
        }

        let content = `BÁO CÁO DANH SÁCH ĐƠN HÀNG - ${timestamp}\n`;
        content += `-------------------------------------------\n`;
        content += `Tổng số đơn hàng: ${orders.length}\n`;
        content += `Tổng doanh thu: ${orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total_price || 0), 0).toLocaleString()} ₫\n\n`;
        
        content += `CHI TIẾT ĐƠN HÀNG:\n`;
        orders.forEach((o, i) => {
            content += `${i+1}. Mã: ${o._id.toUpperCase()} | Khách: ${o.user_id?.name || 'N/A'} | Tổng: ${o.total_price?.toLocaleString()} ₫ | Trạng thái: ${getStatusText(o.status)}\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'pending') return orders.filter((o) => o.status === 'pending');
        if (statusFilter === 'shipping') return orders.filter((o) => o.status === 'shipped' || o.status === 'processing');
        if (statusFilter === 'delivered') return orders.filter((o) => o.status === 'delivered');
        if (statusFilter === 'cancelled') return orders.filter((o) => o.status === 'cancelled');
        return orders;
    }, [orders, statusFilter]);

    const sortedOrders = useMemo(() => {
        const list = [...filteredOrders];
        if (sortOption === 'oldest') {
            return list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
        if (sortOption === 'price_desc') {
            return list.sort((a, b) => (b.total_price ?? 0) - (a.total_price ?? 0));
        }
        if (sortOption === 'price_asc') {
            return list.sort((a, b) => (a.total_price ?? 0) - (b.total_price ?? 0));
        }
        return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [filteredOrders, sortOption]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, sortOption]);

    const pageCount = Math.ceil(sortedOrders.length / pageSize);
    const safePageCount = pageCount === 0 ? 1 : pageCount;

    useEffect(() => {
        if (pageCount === 0) {
            if (currentPage !== 1) setCurrentPage(1);
            return;
        }
        if (currentPage > pageCount) setCurrentPage(pageCount);
    }, [currentPage, pageCount]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedOrders.slice(startIndex, startIndex + pageSize);
    }, [currentPage, sortedOrders]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: safePageCount }, (_, idx) => idx + 1);
    }, [safePageCount]);

    return (
        <AdminLayout
            title="Quản lý Đơn hàng"
        >
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

            {/* Dashboard Stats (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Tổng đơn hàng</span>
                    <span className="text-2xl font-bold text-on-surface">{orders.length}</span>
                    <span className="text-xs text-slate-500 font-medium">Cập nhật theo dữ liệu hệ thống</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Chờ xử lý</span>
                    <span className="text-2xl font-bold text-on-surface">{orders.filter(o => o.status === 'pending').length}</span>
                    <span className="text-xs text-slate-500 font-medium">Cần xác nhận</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Đang giao</span>
                    <span className="text-2xl font-bold text-on-surface">{orders.filter(o => o.status === 'shipped' || o.status === 'processing').length}</span>
                    <span className="text-xs text-slate-500 font-medium">Đang xử lý / đang giao</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Tổng Doanh thu</span>
                    <span className="text-2xl font-bold text-on-surface">{orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + (order.total_price || 0), 0).toLocaleString()} ₫</span>
                    <span className="text-xs text-slate-500 font-medium">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-surface-container-low p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={statusFilter === 'all'
                            ? "px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold whitespace-nowrap"
                            : "px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"}
                    >
                        Tất cả
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={statusFilter === 'pending'
                            ? "px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold whitespace-nowrap"
                            : "px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"}
                    >
                        Chờ xác nhận
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('shipping')}
                        className={statusFilter === 'shipping'
                            ? "px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold whitespace-nowrap"
                            : "px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"}
                    >
                        Đang giao
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('delivered')}
                        className={statusFilter === 'delivered'
                            ? "px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold whitespace-nowrap"
                            : "px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"}
                    >
                        Đã giao
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('cancelled')}
                        className={statusFilter === 'cancelled'
                            ? "px-5 py-2 rounded-full bg-error text-white text-sm font-semibold whitespace-nowrap"
                            : "px-5 py-2 rounded-full bg-surface-container-lowest text-error text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"}
                    >
                        Đã hủy
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="appearance-none bg-surface-container-lowest border-none rounded-xl px-4 py-2 pr-10 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                        >
                            <option value="newest">Sắp xếp: Mới nhất</option>
                            <option value="oldest">Sắp xếp: Cũ nhất</option>
                            <option value="price_desc">Giá: Cao đến thấp</option>
                            <option value="price_asc">Giá: Thấp đến cao</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-sm">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/10 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Mã đơn</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Khách hàng</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Ngày đặt</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Tổng tiền</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Trạng thái</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-[0.1em] text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedOrders.map((row) => {
                                const style = statusStyles(row.status);
                                const username = row.user_id?.name || 'Unknown';
                                const avatarColor = getAvatarColor(username);
                                const isCancelled = row.status === 'cancelled';
                                
                                return (
                                    <tr key={row._id} className={`hover:bg-slate-50/50 transition-colors ${isCancelled ? 'opacity-75' : ''}`}>
                                        <td className={`px-6 py-5 font-semibold ${isCancelled ? 'text-slate-400' : 'text-primary'}`}>{row._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor}`}>
                                                    {username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className={`text-sm font-semibold ${isCancelled ? 'text-slate-500' : 'text-on-surface'}`}>{username}</div>
                                                    <div className={`text-xs ${isCancelled ? 'text-slate-400' : 'text-secondary'}`}>{row.user_id?.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-5 text-sm ${isCancelled ? 'text-slate-500' : 'text-on-surface'}`}>
                                            {new Date(row.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className={`px-6 py-5 text-sm font-bold ${isCancelled ? 'text-slate-500 line-through' : 'text-on-surface'}`}>
                                            {row.total_price.toLocaleString()} ₫
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                                                {style.dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>}
                                                {style.icon && <span className="material-symbols-outlined text-xs">{style.icon}</span>}
                                                {getStatusText(row.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(row._id)}
                                                className={`${isCancelled ? 'text-slate-400 hover:text-primary' : 'text-primary hover:underline'} text-sm font-semibold transition-colors`}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/30">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="p-1 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-30"
                                disabled={currentPage <= 1}
                            >
                                <span className="material-symbols-outlined text-xl">chevron_left</span>
                            </button>
                            {pageNumbers.map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={page === currentPage
                                        ? "w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-xs font-bold"
                                        : "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-xs font-bold"}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(safePageCount, p + 1))}
                                className="p-1 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-30"
                                disabled={currentPage >= safePageCount}
                            >
                                <span className="material-symbols-outlined text-xl">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
                <span className="absolute right-16 bg-on-surface text-surface text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tạo đơn mới</span>
            </button>

            {detailOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
                    <button type="button" className="absolute inset-0 bg-black/50" onClick={closeDetail} />
                    <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-on-surface">Chi tiết đơn hàng</div>
                                <div className="text-xs text-secondary">{detailOrderId ? `Mã đơn: ${detailOrderId.slice(-6).toUpperCase()}` : ''}</div>
                            </div>
                            <button type="button" onClick={closeDetail} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            {detailLoading && (
                                <div className="text-sm text-secondary">Đang tải chi tiết đơn hàng...</div>
                            )}

                            {!detailLoading && detailData?.order && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <div className="text-xs font-bold text-secondary uppercase tracking-widest">Khách hàng</div>
                                                    <div className="font-semibold text-on-surface">{detailData.order.user_id?.name || 'N/A'}</div>
                                                    <div className="text-xs text-secondary">{detailData.order.user_id?.email || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-secondary uppercase tracking-widest">Ngày đặt</div>
                                                    <div className="font-semibold text-on-surface">
                                                        {new Date(detailData.order.created_at).toLocaleString('vi-VN')}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <div className="text-xs font-bold text-secondary uppercase tracking-widest">Địa chỉ giao hàng</div>
                                                    <div className="font-semibold text-on-surface">{detailData.order.shipping_address || 'Chưa cung cấp'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-secondary uppercase tracking-widest">Phương thức thanh toán</div>
                                                    <div className="font-semibold text-on-surface">{detailData.order.payment_method === 'COD' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-secondary uppercase tracking-widest">Tổng tiền</div>
                                                    <div className="font-extrabold text-primary">{(detailData.order.total_price || 0).toLocaleString()} ₫</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-slate-100 text-xs font-bold text-secondary uppercase tracking-widest">
                                                Sản phẩm trong đơn
                                            </div>
                                            <div className="max-h-[280px] overflow-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="bg-slate-50/50 sticky top-0">
                                                        <tr>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Sản phẩm</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">Giá</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-secondary uppercase tracking-[0.1em]">SL</th>
                                                            <th className="px-4 py-3 text-[11px] font-bold text-secondary uppercase tracking-[0.1em] text-right">Thành tiền</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {(detailData.items || []).map((item) => (
                                                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-4 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        {item.product_id?.images?.[0] && (
                                                                            <img
                                                                                src={getImageURL(item.product_id.images[0])}
                                                                                alt={item.product_id?.name || 'Sản phẩm'}
                                                                                className="w-10 h-10 rounded-lg object-cover border border-outline-variant/20"
                                                                            />
                                                                        )}
                                                                        <div className="text-sm font-semibold text-on-surface">
                                                                            {item.product_id?.name || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4 text-sm font-semibold text-on-surface">{(item.price || 0).toLocaleString()} ₫</td>
                                                                <td className="px-4 py-4 text-sm text-on-surface">{item.quantity || 0}</td>
                                                                <td className="px-4 py-4 text-sm font-extrabold text-on-surface text-right">{((item.price || 0) * (item.quantity || 0)).toLocaleString()} ₫</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-1 space-y-4">
                                        {/* Order Status Update */}
                                        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                                            <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Trạng thái đơn hàng</div>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <select
                                                        value={statusDraft}
                                                        onChange={(e) => setStatusDraft(e.target.value)}
                                                        className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                                                        disabled={statusSaving}
                                                    >
                                                        <option value="pending">Chờ xử lý</option>
                                                        <option value="processing">Đang xử lý</option>
                                                        <option value="shipped">Đang giao</option>
                                                        <option value="delivered">Đã giao</option>
                                                        <option value="cancelled">Đã hủy</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-sm">expand_more</span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={saveStatus}
                                                    disabled={statusSaving || !detailData?.order || statusDraft === detailData.order.status}
                                                    className="w-full bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {statusSaving ? 'Đang cập nhật...' : 'Lưu trạng thái đơn'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payment Status Update */}
                                        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                                            <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Trạng thái thanh toán</div>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <select
                                                        value={paymentStatusDraft}
                                                        onChange={(e) => setPaymentStatusDraft(e.target.value)}
                                                        className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                                                        disabled={paymentStatusSaving}
                                                    >
                                                        <option value="pending">Chờ thanh toán</option>
                                                        <option value="paid">Đã thanh toán</option>
                                                        <option value="failed">Thanh toán thất bại</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-sm">expand_more</span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={savePaymentStatus}
                                                    disabled={paymentStatusSaving || !detailData?.order || paymentStatusDraft === detailData.order.payment_status}
                                                    className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {paymentStatusSaving ? 'Đang cập nhật...' : 'Lưu trạng thái tiền'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
