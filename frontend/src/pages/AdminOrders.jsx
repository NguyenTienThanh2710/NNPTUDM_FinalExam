import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const statusStyles = (status) => {
    switch (status) {
        case 'pending':
            return {
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                dot: 'bg-amber-500 animate-pulse',
                icon: 'schedule'
            };
        case 'processing':
            return {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                dot: 'bg-blue-500',
                icon: 'sync'
            };
        case 'shipped':
            return {
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                dot: 'bg-purple-500',
                icon: 'local_shipping'
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

    return (
        <AdminLayout
            title="Quản lý Đơn hàng"
            subtitle="Theo dõi và cập nhật trạng thái đơn hàng thời gian thực."
            actions={
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
                    </div>
                </div>
            </div>

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
        </AdminLayout>
    );
};

export default AdminOrders;