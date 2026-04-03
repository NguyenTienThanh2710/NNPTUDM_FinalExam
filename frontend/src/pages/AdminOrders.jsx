import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
import AdminLayout from './AdminLayout';
import api from '../services/api';

const statusStyles = (status) => {
    switch (status) {
        case 'pending':
            return {
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                dot: 'bg-amber-500 animate-pulse',
<<<<<<< HEAD
                icon: 'schedule'
            };
        case 'processing':
=======
                icon: null
            };
        case 'processing':
        case 'shipped':
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            return {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                dot: 'bg-blue-500',
<<<<<<< HEAD
                icon: 'sync'
            };
        case 'shipped':
            return {
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                dot: 'bg-purple-500',
                icon: 'local_shipping'
=======
                icon: null
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
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
<<<<<<< HEAD
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/orders/all');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Không thể lấy danh sách đơn hàng. Vui lòng kiểm tra lại kết nối.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusText = (status) => {
        const map = { 
            pending: 'Chờ xử lý', 
            processing: 'Đang xử lý', 
            shipped: 'Đang giao', 
            delivered: 'Đã giao', 
            cancelled: 'Đã hủy' 
        };
        return map[status] || status;
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = !searchTerm.trim() || 
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user_id?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user_id?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

=======

    useEffect(() => {
        api.get('/orders/all').then(res => setOrders(res.data)).catch(console.error);
    }, []);

    const getStatusText = (status) => {
        const map = { pending: 'Chờ xử lý', processing: 'Đang xử lý', shipped: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
        return map[status] || status;
    };

>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
    return (
        <AdminLayout
            title="Quản lý Đơn hàng"
            subtitle="Theo dõi và cập nhật trạng thái đơn hàng thời gian thực."
            actions={
<<<<<<< HEAD
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchOrders}
                        disabled={loading}
                        className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>refresh</span>
                        Làm mới
                    </button>
                    <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Xuất báo cáo
                    </button>
                </div>
            }
        >
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-left">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng đơn hàng</span>
                    <span className="text-3xl font-black text-slate-900">{orders.length}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Chờ xử lý</span>
                    <span className="text-3xl font-black text-slate-900">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Đang giao</span>
                    <span className="text-3xl font-black text-slate-900">{orders.filter(o => o.status === 'shipped' || o.status === 'processing').length}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Doanh thu</span>
                    <span className="text-3xl font-black text-slate-900">
                        {orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_price, 0).toLocaleString()} ₫
                    </span>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl mb-6 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'pending', label: 'Chờ xác nhận' },
                        { id: 'processing', label: 'Đang xử lý' },
                        { id: 'shipped', label: 'Đang giao' },
                        { id: 'delivered', label: 'Đã giao' },
                        { id: 'cancelled', label: 'Đã hủy' },
                    ].map(btn => (
                        <button 
                            key={btn.id}
                            onClick={() => setFilterStatus(btn.id)}
                            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${filterStatus === btn.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input 
                            type="text"
                            placeholder="Mã đơn, tên khách..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none w-64 transition-all"
                        />
=======
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
                    <span className="text-xs text-green-600 flex items-center gap-1 font-medium">+12% so với tháng trước</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Chờ xử lý</span>
                    <span className="text-2xl font-bold text-on-surface">{orders.filter(o => o.status === 'pending').length}</span>
                    <span className="text-xs text-amber-600 font-medium italic">Yêu cầu xử lý ngay</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Đang giao</span>
                    <span className="text-2xl font-bold text-on-surface">{orders.filter(o => o.status === 'shipped' || o.status === 'processing').length}</span>
                    <span className="text-xs text-blue-600 font-medium">Đang trong lộ trình</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col gap-1">
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase">Tổng Doanh thu</span>
                    <span className="text-2xl font-bold text-on-surface">{(orders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.total_price, 0) || orders.reduce((sum, order) => sum + order.total_price, 0)).toLocaleString()} ₫</span>
                    <span className="text-xs text-slate-500 font-medium">Hôm nay, {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-surface-container-low p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <button className="px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold whitespace-nowrap">Tất cả</button>
                    <button className="px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap">Chờ xác nhận</button>
                    <button className="px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap">Đang giao</button>
                    <button className="px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap">Đã giao</button>
                    <button className="px-5 py-2 rounded-full bg-surface-container-lowest text-secondary text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap text-error">Đã hủy</button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select className="appearance-none bg-surface-container-lowest border-none rounded-xl px-4 py-2 pr-10 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer">
                            <option>Sắp xếp: Mới nhất</option>
                            <option>Sắp xếp: Cũ nhất</option>
                            <option>Giá: Cao đến thấp</option>
                            <option>Giá: Thấp đến cao</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-sm">expand_more</span>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl mb-6 flex items-center gap-3 font-bold border border-red-100 animate-fade-in">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đơn</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày đặt</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thanh toán</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined animate-spin text-4xl text-slate-200">progress_activity</span>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang tải dữ liệu...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-5xl text-slate-100">inventory_2</span>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Không có kết quả phù hợp</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const style = statusStyles(order.status);
                                    const username = order.user_id?.name || 'Vãng lai';
                                    const avatarCol = getAvatarColor(username);
                                    const isCancelled = order.status === 'cancelled';

                                    return (
                                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-black text-slate-400 font-mono uppercase">#{order._id.slice(-8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${avatarCol}`}>
                                                        {username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{username}</div>
                                                        <div className="text-[10px] font-medium text-slate-400">{order.user_id?.email || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-xs font-bold text-slate-500">
                                                {new Date(order.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td className="px-6 py-5 text-sm font-black text-slate-900">
                                                {order.total_price.toLocaleString()} ₫
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.bg} ${style.text}`}>
                                                    <span className="material-symbols-outlined text-xs">{style.icon}</span>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}</span>
                                                    <span className={`text-[9px] font-black uppercase ${order.payment_status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                                                        {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                    className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                                                >
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
=======
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
                            {orders.map((row) => {
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
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <span className="text-xs text-secondary font-medium">Hiển thị {orders.length} đơn hàng</span>
                    <div className="flex items-center gap-1">
                        <button className="p-1 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-30" disabled>
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-xs font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-xs font-bold">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-xs font-bold">3</button>
                        <span className="px-2 text-slate-400">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-xs font-bold">129</button>
                        <button className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* FAB */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
                <span className="absolute right-16 bg-on-surface text-surface text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Tạo đơn mới</span>
            </button>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        </AdminLayout>
    );
};

export default AdminOrders;