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
                    </button>
                </>
            )}
        >
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
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
                </div>
            </div>
        </AdminLayout>
    );
};

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

export default AdminDashboard;