import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

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
    const pageSize = 10;

    useEffect(() => {
        api.get('/orders/all').then(res => setOrders(res.data)).catch(console.error);
    }, []);

    const getStatusText = (status) => {
        const map = { pending: 'Chờ xử lý', processing: 'Đang xử lý', shipped: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
        return map[status] || status;
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
            
            actions={
                <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Xuất báo cáo
                </button>
            }
        >
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
                                            <button className={`${isCancelled ? 'text-slate-400 hover:text-primary' : 'text-primary hover:underline'} text-sm font-semibold transition-colors`}>
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
        </AdminLayout>
    );
};

export default AdminOrders;
