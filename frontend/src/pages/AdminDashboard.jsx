import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [wishlistStats, setWishlistStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch general dashboard stats (Upstream)
                const res = await api.get('/orders/dashboard');
                setStats(res.data);

                // Fetch wishlist stats (Stashed) using internal api instance
                const resWishlist = await api.get('/admin/stats/wishlist');
                if (resWishlist.data.success) {
                    setWishlistStats(resWishlist.data.data.slice(0, 5)); // Top 5 for dashboard
                }
            } catch (err) {
                console.error('Fetch Stats Error:', err);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const monthly = useMemo(() => stats?.monthlyRevenue || [], [stats]);
    const maxMonthly = useMemo(() => {
        const values = monthly.map((m) => m.total || 0);
        return Math.max(1, ...values);
    }, [monthly]);

    return (
        <AdminLayout
            title="Bảng điều khiển"
            actions={(
                <>
                    <button className="bg-surface-container-high text-on-surface font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-80 transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Xuất báo cáo
                    </button>
                    <button
                        onClick={() => navigate('/admin/products?create=1')}
                        className="bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-300"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Thêm sản phẩm mới
                    </button>
                </>
            )}
        >
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">payments</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Doanh thu hôm nay</p>
                    <h3 className="text-2xl font-bold mt-1">{(stats?.revenueToday || 0).toLocaleString()} VNĐ</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">shopping_bag</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-bold mt-1">{(stats?.totalOrders || 0).toLocaleString()}</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-error-container/50 rounded-lg">
                            <span className="material-symbols-outlined text-error">warning</span>
                        </div>
                        <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full">Critical</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Sắp hết hàng</p>
                    <h3 className="text-2xl font-bold mt-1">{(stats?.lowStockCount || 0).toLocaleString()}</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-high rounded-lg">
                            <span className="material-symbols-outlined text-secondary">group</span>
                        </div>
                        <span className="text-xs font-bold text-outline bg-surface-container-high px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Khách hàng HĐ</p>
                    <h3 className="text-2xl font-bold mt-1">{(stats?.activeCustomers || 0).toLocaleString()}</h3>
                </div>
            </div>

            {/* Main Dashboard Charts/Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 text-left">
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold">Luồng doanh thu hàng tháng</h2>
                        <select className="bg-surface-container-low border-none rounded-lg text-xs font-bold py-1.5 px-3 focus:ring-0">
                            <option>6 tháng qua</option>
                            <option>Từ đầu năm</option>
                        </select>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-2">
                        {(monthly.length > 0 ? monthly : Array.from({ length: 6 }, () => ({ total: 0, month: 0 }))).map((m, idx) => {
                            const pct = Math.round(((m.total || 0) / maxMonthly) * 100);
                            const heightPct = Math.max(6, Math.min(100, pct));
                            const barClass = idx === 5 ? 'bg-primary' : idx >= 3 ? 'bg-primary-fixed' : 'bg-surface-container-high';
                            return (
                                <div key={idx} className={`w-full rounded-t-lg group relative ${barClass}`} style={{ height: `${heightPct}%` }}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {(m.total || 0).toLocaleString()} VNĐ
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                        {(monthly.length > 0 ? monthly : Array.from({ length: 6 }, () => ({ month: '' }))).map((m, idx) => (
                            <span key={idx}>{m.month ? String(m.month).padStart(2, '0') : '--'}</span>
                        ))}
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 flex flex-col h-[500px]">
                    <h2 className="text-xl font-bold mb-6">Sản phẩm được yêu thích</h2>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <span className="animate-spin material-symbols-outlined text-primary text-2xl">sync</span>
                            </div>
                        ) : wishlistStats.length > 0 ? (
                            wishlistStats.map((item, index) => (
                                <div key={item.product_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-all">
                                    <div className="relative">
                                        <img 
                                            src={item.images && item.images[0]} 
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{item.name}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-primary text-xs font-black">{item.count}</span>
                                            <span className="text-[10px] text-outline font-medium uppercase">yêu thích</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-secondary text-sm">
                                Chưa có dữ liệu yêu thích.
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => navigate('/admin/stats')}
                        className="w-full mt-6 py-3 rounded-xl border border-outline-variant/20 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                    >
                        Xem tất cả số liệu
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
