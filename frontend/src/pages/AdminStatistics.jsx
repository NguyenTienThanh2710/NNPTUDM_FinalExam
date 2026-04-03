<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#003ec7', '#0052ff', '#3b82f6', '#93c5fd', '#d1e9ff'];

const AdminStatistics = () => {
    const [summary, setSummary] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [sumRes, revRes, catRes, saleRes] = await Promise.all([
                    api.get('/statistics/summary'),
                    api.get('/statistics/revenue-chart'),
                    api.get('/statistics/category-distribution'),
                    api.get('/statistics/recent-transactions')
                ]);
                setSummary(sumRes.data);
                setRevenueData(revRes.data);
                setCategoryData(catRes.data);
                setRecentSales(saleRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Lỗi tải dữ liệu thống kê:', err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !summary) {
        return (
            <AdminLayout title="Thống kê & Phân tích">
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-outline tracking-widest uppercase">Đang tổng hợp báo cáo chuyên sâu...</p>
                </div>
            </AdminLayout>
        );
    }

    const avgOrderValue = summary.totalOrders > 0 ? Math.round(summary.totalRevenue / summary.totalOrders) : 0;

    return (
        <AdminLayout
            title="Thống kê & Phân tích"
            subtitle="Báo cáo chi tiết về dòng tiền, sản phẩm và hành vi người dùng."
            actions={(
                <div className="flex gap-3">
                    <div className="bg-surface-container-high px-4 py-2.5 rounded-xl text-xs font-black text-on-surface flex items-center gap-2 border border-outline-variant/10">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        30 NGÀY QUA
                    </div>
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span>
                        TẢI BÁO CÁO (PDF)
                    </button>
                </div>
            )}
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                <StatCard 
                    title="Lợi nhuận gộp" 
                    value={`${summary.totalRevenue.toLocaleString()} ₫`} 
                    icon="payments" 
                    trend="+12.5%" 
                    color="blue"
                    footnote="Dựa trên doanh thu đơn hàng đã xử lý"
                />
                <StatCard 
                    title="Giá trị TB đơn hàng" 
                    value={`${avgOrderValue.toLocaleString()} ₫`} 
                    icon="receipt_long" 
                    trend="+4.2%" 
                    color="purple"
                    footnote={`Tổng cộng ${summary.totalOrders} giao dịch`}
                />
                <StatCard 
                    title="Tỷ lệ lặp lại" 
                    value={`${Math.round((summary.totalCustomers / (summary.totalOrders || 1)) * 100)}%`} 
                    icon="group" 
                    trend="Ổn định" 
                    color="orange"
                    footnote="Tỷ lệ khách hàng quay lại mua hàng"
                />
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 text-left">
                {/* Bar Chart Revenue */}
                <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h4 className="text-xl font-bold tracking-tight">Dòng tiền theo thời gian</h4>
                            <p className="text-xs text-secondary mt-1">BIỂU ĐỒ DOANH THU 30 NGÀY GẦN NHẤT</p>
                        </div>
                    </div>
                    
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fill: '#64748b', fontWeight: 700}}
                                    interval={2}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}}
                                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f1f5f9'}}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold'}}
                                    formatter={(val) => `${val.toLocaleString()} ₫`}
                                />
                                <Bar 
                                    dataKey="revenue" 
                                    fill="#003ec7" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={20}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Distribution */}
                <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/5 flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-bold tracking-tight mb-1">Cơ cấu danh mục</h4>
                        <p className="text-[10px] font-black text-outline uppercase tracking-widest">PHÂN BỔ SỐ LƯỢNG MẶT HÀNG</p>
                    </div>
                    
                    <div className="h-[280px] my-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-5 rounded-2xl">
                        <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Thông tin nhanh</h5>
                        {categoryData.slice(0, 3).map((cat, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-600">{cat.name}</span>
                                <span className="font-black text-on-surface">{cat.value} SP</span>
                            </div>
                        ))}
=======
import React from 'react';
import AdminLayout from './AdminLayout';

const AdminStatistics = () => {
    return (
        <AdminLayout
            title="Thống kê & Phân tích"
            subtitle="Báo cáo hệ thống và hiệu suất tổng quan."
            actions={(
                <>
                    <button className="bg-surface-container-high px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        30 ngày qua
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Xuất báo cáo
                    </button>
                </>
            )}
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <span className="material-symbols-outlined text-blue-700">payments</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Lợi nhuận ròng</p>
                    <h3 className="text-2xl font-bold text-on-surface">2.450.000.000đ</h3>
                    <p className="text-[10px] text-outline mt-3 uppercase tracking-wider">Dự báo: Tăng trưởng ổn định</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <span className="material-symbols-outlined text-purple-700">ads_click</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Tỷ lệ chuyển đổi</p>
                    <h3 className="text-2xl font-bold text-on-surface">3.85%</h3>
                    <div className="w-full bg-surface-container mt-4 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[65%]"></div>
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <span className="material-symbols-outlined text-orange-700">shopping_bag</span>
                        </div>
                        <span className="text-xs font-bold text-error bg-error-container/20 px-2 py-1 rounded-full">-1.2%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Giá trị đơn hàng TB</p>
                    <h3 className="text-2xl font-bold text-on-surface">18.500.000đ</h3>
                    <p className="text-[10px] text-outline mt-3 uppercase tracking-wider">Dựa trên 1,240 giao dịch</p>
                </div>
            </div>

            {/* Bento Grid Charts */}
            <div className="grid grid-cols-12 gap-6 text-left">
                {/* Main Revenue Chart */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 h-[450px] relative overflow-hidden flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h4 className="text-lg font-bold">Doanh thu theo thời gian</h4>
                            <p className="text-xs text-secondary">Thống kê chi tiết từ 01/10 - 31/10</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-xs font-medium text-secondary">
                                <span className="w-3 h-3 rounded-full bg-primary"></span> Doanh thu
                            </span>
                            <span className="flex items-center gap-2 text-xs font-medium text-secondary">
                                <span className="w-3 h-3 rounded-full bg-primary-container opacity-30"></span> Mục tiêu
                            </span>
                        </div>
                    </div>
                    
                    {/* Mock Chart Visualization */}
                    <div className="relative w-full flex-grow flex items-end justify-between px-2 pt-4">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                        </div>
                        
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[60%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[45%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 1</span>
                        </div>
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[75%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[65%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 2</span>
                        </div>
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[85%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[95%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity shadow-lg shadow-primary/30"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 3</span>
                        </div>
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[70%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[55%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 4</span>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 h-[450px] flex flex-col items-center justify-center">
                    <div className="w-full">
                        <h4 className="text-lg font-bold mb-1">Sản phẩm bán chạy</h4>
                        <p className="text-xs text-secondary mb-8">Tỷ trọng theo danh mục</p>
                    </div>
                    
                    <div className="relative w-48 h-48 mb-8">
                        {/* Custom SVG Pie Chart */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#eeeef0" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#003ec7" strokeDasharray="45 100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#0052ff" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#b7c4ff" strokeDasharray="30 100" strokeDashoffset="-70" strokeWidth="4"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold">840</span>
                            <span className="text-[10px] text-outline font-bold">SẢN PHẨM</span>
                        </div>
                    </div>
                    
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <span className="text-xs font-medium text-on-surface">iPhone Series</span>
                            </div>
                            <span className="text-xs font-bold">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                <span className="text-xs font-medium text-on-surface">Galaxy S Series</span>
                            </div>
                            <span className="text-xs font-bold">25%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                                <span className="text-xs font-medium text-on-surface">Phụ kiện cao cấp</span>
                            </div>
                            <span className="text-xs font-bold">30%</span>
                        </div>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {/* Recent Transactions Table */}
            <section className="text-left">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-xl font-bold tracking-tight">Giao dịch gần đây</h4>
                        <p className="text-xs text-secondary mt-0.5">Thời gian thực từ cơ sở dữ liệu</p>
                    </div>
                    <button className="text-primary font-bold text-xs hover:underline flex items-center gap-1">
                        Xem tất cả lịch sử <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/5">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Mã đơn</th>
                                <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Khách hàng</th>
                                <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Ngày đặt</th>
                                <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Tổng tiền</th>
                                <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest text-right">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentSales.map(order => (
                                <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-black text-primary">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                                                <img src={order.user_id?.avatar || 'https://i.pravatar.cc/150'} alt={order.user_id?.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-on-surface">{order.user_id?.name || 'Khách hàng ẩn danh'}</span>
                                                <span className="text-[10px] text-secondary font-medium">{order.user_id?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                                        {new Date(order.created_at).toLocaleDateString('vi-VN', { 
                                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-black text-on-surface">
                                        {order.total_price.toLocaleString()} ₫
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
=======
            {/* Latest Sales Feature */}
            <section className="mt-12 text-left">
                <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-6">Giao dịch gần đây</h4>
                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-surface-container-low border-b border-surface-container-high">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">MÃ ĐƠN</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">KHÁCH HÀNG</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">SẢN PHẨM</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">GIÁ TRỊ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">TRẠNG THÁI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">#VOLT-8921</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">NT</div>
                                            <span className="text-sm font-medium">Nguyễn Thành Trung</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-on-surface">iPhone 15 Pro Max 256GB</td>
                                    <td className="px-6 py-4 text-sm font-bold">32.490.000đ</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Hoàn tất</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">#VOLT-8920</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed">HL</div>
                                            <span className="text-sm font-medium">Hoàng Lan Anh</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-on-surface">Samsung Galaxy S24 Ultra</td>
                                    <td className="px-6 py-4 text-sm font-bold">29.990.000đ</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Đang giao</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">#VOLT-8919</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">PV</div>
                                            <span className="text-sm font-medium">Phạm Văn Nam</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-on-surface">Sony WH-1000XM5</td>
                                    <td className="px-6 py-4 text-sm font-bold">8.490.000đ</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Chờ xử lý</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                </div>
            </section>
        </AdminLayout>
    );
};

<<<<<<< HEAD
const StatCard = ({ title, value, icon, trend, color, footnote }) => (
    <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3.5 rounded-2xl ${
                color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
            }`}>
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> {trend}
                </span>
                <span className="text-[10px] text-outline font-bold mt-1 uppercase tracking-widest">So với tháng trước</span>
            </div>
        </div>
        <p className="text-secondary text-xs font-bold mb-1 uppercase tracking-tight">{title}</p>
        <h3 className="text-3xl font-black text-on-surface tracking-tighter mb-4">{value}</h3>
        <p className="text-[10px] text-outline font-medium italic border-t border-slate-50 pt-4">{footnote}</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full translate-x-16 -translate-y-16 -z-10 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
    </div>
);

=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
export default AdminStatistics;