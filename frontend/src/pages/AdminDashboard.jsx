<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#003ec7', '#0052ff', '#b7c4ff', '#e0e5ff', '#f0f2ff'];

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryRes, revenueRes, categoryRes] = await Promise.all([
                    api.get('/statistics/summary'),
                    api.get('/statistics/revenue-chart'),
                    api.get('/statistics/category-distribution')
                ]);
                setSummary(summaryRes.data);
                setRevenueData(revenueRes.data);
                setCategoryData(categoryRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Lỗi tải dữ liệu dashboard:', err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading || !summary) {
        return (
            <AdminLayout title="Bảng điều khiển">
                <div className="flex items-center justify-center h-96 gap-3 text-secondary">
                    <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
                    <span className="font-bold tracking-widest text-xs uppercase">Đang phân tích dữ liệu hệ thống...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Bảng điều khiển"
            subtitle="Số liệu hiệu suất thời gian thực từ cơ sở dữ liệu Lumina Mobile."
            actions={(
                <>
                    <button className="bg-surface-container-high text-on-surface font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 hover:bg-surface-container-highest transition-all duration-300 shadow-sm">
                        <span className="material-symbols-outlined text-sm">download</span>
                        XUẤT BÁO CÁO
                    </button>
                    <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">add</span>
                        THÊM SẢN PHẨM
=======
import React from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    return (
        <AdminLayout
            title="Bảng điều khiển"
            subtitle="Số liệu hiệu suất thời gian thực cho các cửa hàng chủ chốt của Lumina Mobile."
            actions={(
                <>
                    <button className="bg-surface-container-high text-on-surface font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-80 transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Xuất báo cáo
                    </button>
                    <button className="bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Thêm sản phẩm mới
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                    </button>
                </>
            )}
        >
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
<<<<<<< HEAD
                <StatCard 
                    icon="payments" 
                    label="Tổng doanh thu" 
                    value={`${summary.totalRevenue.toLocaleString()} ₫`} 
                    trend="+12.5%" 
                    color="primary" 
                />
                <StatCard 
                    icon="shopping_bag" 
                    label="Tổng đơn hàng" 
                    value={summary.totalOrders} 
                    trend="+4.2%" 
                    color="blue" 
                />
                <StatCard 
                    icon="warning" 
                    label="Sắp hết hàng" 
                    value={summary.lowStockCount} 
                    trend="Cần nhập" 
                    color="error" 
                    isAlert={summary.lowStockCount > 10}
                />
                <StatCard 
                    icon="group" 
                    label="Tổng khách hàng" 
                    value={summary.totalCustomers} 
                    trend="Active" 
                    color="slate" 
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 text-left">
                {/* Revenue Line Chart */}
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-[32px] p-8 shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-xl font-black text-on-surface tracking-tight">Xu hướng doanh thu</h2>
                            <p className="text-xs text-secondary font-medium">Thống kê 30 ngày gần nhất (Dữ liệu thực)</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black text-primary border border-slate-100 italic uppercase">REAL-TIME SYNC</div>
                    </div>
                    
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0052ff" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0052ff" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                                    formatter={(val) => [`${val.toLocaleString()} ₫`, 'Doanh thu']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#0052ff" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Category Pie Chart */}
                <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-sm border border-outline-variant/5 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-xl font-black text-on-surface tracking-tight">Phân bổ kho hàng</h2>
                        <p className="text-xs text-secondary font-medium">Số lượng sản phẩm theo danh mục</p>
                    </div>
                    
                    <div className="flex-1 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend 
                                    verticalAlign="bottom" 
                                    align="center" 
                                    iconType="circle"
                                    wrapperStyle={{fontSize: '11px', fontWeight: 'bold', paddingTop: '20px'}}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50">
                        <div className="flex items-center justify-between text-xs font-bold text-outline uppercase tracking-widest">
                            <span>Sức chứa kho</span>
                            <span>{Math.round((summary.totalOrders / 2000) * 100)}% đầy</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (summary.totalOrders / 2000) * 100)}%` }}></div>
                        </div>
                    </div>
=======
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">payments</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Doanh thu hôm nay</p>
                    <h3 className="text-2xl font-bold mt-1">84,500,000 VNĐ</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">shopping_bag</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-bold mt-1">1,284</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-error-container/50 rounded-lg">
                            <span className="material-symbols-outlined text-error">warning</span>
                        </div>
                        <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full">Critical</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Sắp hết hàng</p>
                    <h3 className="text-2xl font-bold mt-1">12</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-high rounded-lg">
                            <span className="material-symbols-outlined text-secondary">group</span>
                        </div>
                        <span className="text-xs font-bold text-outline bg-surface-container-high px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Khách hàng HĐ</p>
                    <h3 className="text-2xl font-bold mt-1">8,942</h3>
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
                        <div className="w-full bg-surface-container-high rounded-t-lg h-[42%] group relative">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Jun: 420M</div>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-t-lg h-[58%] group relative"></div>
                        <div className="w-full bg-surface-container-high rounded-t-lg h-[46%] group relative"></div>
                        <div className="w-full bg-primary-fixed rounded-t-lg h-[76%] group relative"></div>
                        <div className="w-full bg-primary-fixed rounded-t-lg h-[66%] group relative"></div>
                        <div className="w-full bg-primary rounded-t-lg h-[92%] group relative">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Now: 920M</div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                        <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Phân bổ thiết bị</h2>
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">smartphone</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Lumina Pro 15</span>
                                    <span>62%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full">
                                    <div className="h-full bg-primary rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500">tablet_mac</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Lumina Tab X</span>
                                    <span>24%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full">
                                    <div className="h-full bg-secondary rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-500">watch</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Lumina Watch</span>
                                    <span>14%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full">
                                    <div className="h-full bg-[#bf3003] rounded-full" style={{ width: '14%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-6 py-3 rounded-xl border border-outline-variant/20 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                        Xem tất cả số liệu
                    </button>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                </div>
            </div>
        </AdminLayout>
    );
};

<<<<<<< HEAD
const StatCard = ({ icon, label, value, trend, color, isAlert }) => (
    <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-outline-variant/10 transition-all hover:scale-[1.02] hover:shadow-md duration-300">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl ${
                color === 'primary' ? 'bg-primary/10 text-primary' : 
                color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                color === 'error' ? 'bg-error-container/40 text-error' : 'bg-slate-50 text-slate-600'
            }`}>
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                isAlert ? 'bg-red-600 text-white animate-pulse' : 
                trend.includes('+') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-50'
            }`}>
                {trend}
            </span>
        </div>
        <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-on-surface tracking-tighter">{value}</h3>
    </div>
);

=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
export default AdminDashboard;