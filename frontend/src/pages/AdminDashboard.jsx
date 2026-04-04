import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/orders/dashboard');
                setStats(res.data);
            } catch (_err) {
                setStats(null);
            }
        };
        fetchStats();
    }, []);

    const monthly = useMemo(() => stats?.monthlyRevenue || [], [stats]);
    const maxMonthly = useMemo(() => {
        const values = monthly.map((m) => m.total || 0);
        return Math.max(1, ...values);
    }, [monthly]);

    const distribution = useMemo(() => stats?.productDistribution || [], [stats]);

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
                    
                    {/* Placeholder for Chart using CSS Grids/Flex to simulate */}
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
                
                <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Phân bổ thiết bị</h2>
                    <div className="space-y-6 flex-1">
                        {(distribution.length > 0 ? distribution : [{ name: '---', percent: 0 }, { name: '---', percent: 0 }, { name: '---', percent: 0 }]).slice(0, 3).map((d, idx) => {
                            const icon = idx === 0 ? 'smartphone' : idx === 1 ? 'tablet_mac' : 'watch';
                            const boxClass = idx === 0 ? 'bg-blue-50' : idx === 1 ? 'bg-slate-50' : 'bg-orange-50';
                            const iconClass = idx === 0 ? 'text-primary' : idx === 1 ? 'text-slate-500' : 'text-orange-500';
                            const barClass = idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : 'bg-[#bf3003]';
                            const width = Math.max(0, Math.min(100, d.percent || 0));
                            return (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${boxClass} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${iconClass}`}>{icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm font-bold mb-1">
                                            <span>{d.name}</span>
                                            <span>{width}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container-high rounded-full">
                                            <div className={`h-full ${barClass} rounded-full`} style={{ width: `${width}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <button className="w-full mt-6 py-3 rounded-xl border border-outline-variant/20 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                        Xem tất cả số liệu
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
