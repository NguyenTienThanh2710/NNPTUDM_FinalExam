import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getImageURL } from '../utils/imageUtils';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [wishlistStats, setWishlistStats] = useState([]);
    const [latestOrders, setLatestOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastSync, setLastSync] = useState(new Date());
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchStats = async (isManual = false) => {
        if (isManual) setIsSyncing(true);
        try {
            // Fetch general dashboard stats
            const res = await api.get('/orders/dashboard');
            setStats(res.data);

            // Fetch wishlist stats
            const resWishlist = await api.get('/admin/stats/wishlist');
            if (resWishlist.data.success) {
                setWishlistStats(resWishlist.data.data.slice(0, 5)); // Top 5 for dashboard
            }

            // Fetch latest orders
            const resOrders = await api.get('/orders/all');
            setLatestOrders(resOrders.data.slice(0, 5));
            setLastSync(new Date());
        } catch (err) {
            console.error('Fetch Stats Error:', err);
        } finally {
            setLoading(false);
            if (isManual) {
                setTimeout(() => setIsSyncing(false), 500);
            }
        }
    };

    useEffect(() => {
        fetchStats();
        
        // Auto-refresh every 60 seconds
        const interval = setInterval(() => {
            fetchStats();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const monthly = useMemo(() => stats?.monthlyRevenue || [], [stats]);
    const maxMonthly = useMemo(() => {
        const values = monthly.map((m) => m.total || 0);
        return Math.max(1, ...values);
    }, [monthly]);

    const handleExportReport = (type = 'txt') => {
        if (!stats) return;
        
        const timestamp = new Date().toLocaleString('vi-VN');
        const filename = `Bao_cao_Tong_quan_${new Date().getTime()}`;

        if (type === 'pdf') {
            const doc = new jsPDF();
            
            // Title
            doc.setFontSize(22);
            doc.text('BÁO CÁO TỔNG QUAN HỆ THỐNG', 105, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.text(`Thời gian xuất: ${timestamp}`, 105, 30, { align: 'center' });
            
            // 1. General Stats
            doc.setFontSize(14);
            doc.text('1. Thông số tổng quan:', 20, 45);
            
            const generalData = [
                ['Doanh thu hôm nay', `${stats.revenueToday?.toLocaleString()} VNĐ`],
                ['Tổng đơn hàng', stats.totalOrders.toString()],
                ['Sản phẩm sắp hết hàng', stats.lowStockCount.toString()],
                ['Khách hàng hoạt động', stats.activeCustomers.toString()]
            ];
            
            autoTable(doc, {
                startY: 50,
                head: [['Tham số', 'Giá trị']],
                body: generalData,
                theme: 'striped',
                headStyles: { fillColor: [0, 62, 199] }
            });
            
            // 2. Monthly Revenue
            const finalY1 = doc.lastAutoTable.finalY + 15;
            doc.text('2. Doanh thu hàng tháng:', 20, finalY1);
            
            const monthlyData = monthly.map(m => [`Tháng ${m.month}`, `${m.total?.toLocaleString()} VNĐ`]);
            
            autoTable(doc, {
                startY: finalY1 + 5,
                head: [['Tháng', 'Doanh thu']],
                body: monthlyData,
                theme: 'striped',
                headStyles: { fillColor: [0, 62, 199] }
            });
            
            // 3. Wishlist Stats
            const finalY2 = doc.lastAutoTable.finalY + 15;
            doc.text('3. Sản phẩm yêu thích nhất:', 20, finalY2);
            
            const wishData = wishlistStats.map((item, idx) => [idx + 1, item.name, `${item.count} lượt`]);
            
            autoTable(doc, {
                startY: finalY2 + 5,
                head: [['STT', 'Sản phẩm', 'Lượt yêu thích']],
                body: wishData,
                theme: 'striped',
                headStyles: { fillColor: [0, 62, 199] }
            });

            doc.save(`${filename}.pdf`);
            return;
        }

        // TXT Export
        let content = `BÁO CÁO TỔNG QUAN HỆ THỐNG - ${timestamp}\n`;
        content += `===========================================\n\n`;
        content += `1. THÔNG SỐ TỔNG QUAN:\n`;
        content += `- Doanh thu hôm nay: ${stats.revenueToday?.toLocaleString()} VNĐ\n`;
        content += `- Tổng đơn hàng: ${stats.totalOrders}\n`;
        content += `- Sản phẩm sắp hết hàng: ${stats.lowStockCount}\n`;
        content += `- Khách hàng hoạt động: ${stats.activeCustomers}\n\n`;
        
        content += `2. DOANH THU HÀNG THÁNG:\n`;
        monthly.forEach(m => {
            content += `- Tháng ${m.month}: ${m.total?.toLocaleString()} VNĐ\n`;
        });
        
        content += `\n3. SẢN PHẨM ƯU THÍCH:\n`;
        wishlistStats.forEach((item, idx) => {
            content += `${idx + 1}. ${item.name} (${item.count} lượt yêu thích)\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout
            title="Tổng quan hệ thống"
            actions={(
                <div className="flex gap-3">
                    <button 
                        onClick={() => fetchStats(true)}
                        disabled={isSyncing}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface transition-all active:scale-95 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/5'}`}
                        title="Làm mới dữ liệu"
                    >
                        <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
                        <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Làm mới</span>
                    </button>
                    <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                        <button 
                            onClick={() => handleExportReport('txt')}
                            className="text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                            title="Xuất file TEXT"
                        >
                            <span className="material-symbols-outlined text-sm">description</span>
                            TEXT
                        </button>
                        <div className="w-px h-4 bg-outline-variant/20 self-center mx-1"></div>
                        <button 
                            onClick={() => handleExportReport('pdf')}
                            className="text-on-surface-variant hover:text-error px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                            title="Xuất file PDF"
                        >
                            <span className="material-symbols-outlined text-sm text-error">picture_as_pdf</span>
                            PDF
                        </button>
                    </div>
                </div>
            )}
        >
            <div className="mb-4 flex justify-end">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Cập nhật lần cuối: {lastSync.toLocaleTimeString('vi-VN')}
                </span>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">+12.5%</span>
                    </div>
                    <p className="text-xs font-black text-outline uppercase tracking-widest">Doanh thu hôm nay</p>
                    <h3 className="text-2xl font-black mt-2 text-on-surface">{(stats?.revenueToday || 0).toLocaleString()} VNĐ</h3>
                    <p className="text-[10px] text-outline mt-4 font-bold border-t border-outline-variant/5 pt-4">LỢI NHUẬN GỘP TỪ ĐƠN HÀNG</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">+4.2%</span>
                    </div>
                    <p className="text-xs font-black text-outline uppercase tracking-widest">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-black mt-2 text-on-surface">{(stats?.totalOrders || 0).toLocaleString()}</h3>
                    <p className="text-[10px] text-outline mt-4 font-bold border-t border-outline-variant/5 pt-4 text-center">HỆ THỐNG GHI NHẬN</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-error-container/20 rounded-2xl flex items-center justify-center text-error">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                        </div>
                        <span className="text-[10px] font-black text-error bg-error-container/40 px-2.5 py-1 rounded-full uppercase tracking-wider">CRITICAL</span>
                    </div>
                    <p className="text-xs font-black text-outline uppercase tracking-widest">Cảnh báo hết hàng ({stats?.lowStockThreshold || 10})</p>
                    <h3 className="text-2xl font-black mt-2 text-on-surface">{(stats?.lowStockCount || 0).toLocaleString()}</h3>
                    <div className="w-full bg-surface-container mt-4 h-1 rounded-full overflow-hidden">
                        <div 
                            className="bg-error h-full transition-all duration-500" 
                            style={{width: `${Math.min(100, ((stats?.lowStockCount || 0) / 20) * 100)}%`}}
                        ></div>
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                            <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                        <span className="text-[10px] font-black text-primary-fixed bg-primary-fixed/20 px-2.5 py-1 rounded-full uppercase tracking-wider">ACTIVE</span>
                    </div>
                    <p className="text-xs font-black text-outline uppercase tracking-widest">Khách hàng HĐ</p>
                    <h3 className="text-2xl font-black mt-2 text-on-surface">{(stats?.activeCustomers || 0).toLocaleString()}</h3>
                    <div className="flex -space-x-2 mt-4">
                        {(stats?.recentActiveUsers || []).map((u, i) => (
                            <div key={u._id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden" title={u.name}>
                                {u.avatar ? (
                                    <img src={getImageURL(u.avatar)} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-black text-primary">{(u.name || 'U')[0]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-12 gap-8 mb-10 text-left">
                {/* Revenue Chart from Statistics Style */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 h-[480px] flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Doanh thu theo thời gian</h2>
                            <p className="text-xs text-secondary font-medium mt-1">Biểu đồ tăng trưởng doanh thu 6 tháng gần nhất</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-outline uppercase">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Thực thu
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-outline uppercase">
                                <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high"></span> Mục tiêu
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-grow flex items-end justify-between gap-4 px-2 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-10 pt-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="border-t border-outline-variant/10 w-full h-0"></div>
                            ))}
                        </div>

                        {monthly.length > 0 ? monthly.map((m, idx) => {
                            const pct = Math.round(((m.total || 0) / maxMonthly) * 100);
                            const heightPct = Math.max(8, Math.min(100, pct));
                            return (
                                <div key={idx} className="group relative flex flex-col justify-end w-full h-full pb-10">
                                    {/* Indicator Tag on Hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl">
                                        {(m.total || 0).toLocaleString()}đ
                                    </div>
                                    
                                    {/* Bar shadow/glow on hover */}
                                    <div className="absolute inset-x-0 bottom-10 bg-primary/5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-all duration-300 h-[85%]"></div>
                                    
                                    {/* Main Bar */}
                                    <div 
                                        className="bg-primary hover:brightness-125 w-full rounded-t-xl relative z-10 transition-all duration-700 shadow-lg shadow-primary/10" 
                                        style={{ height: `${heightPct}%` }}
                                    ></div>
                                    
                                    <span className="absolute bottom-0 w-full text-center text-[10px] font-black text-outline uppercase tracking-widest mt-4">T.{String(m.month).padStart(2, '0')}</span>
                                </div>
                            );
                        }) : Array.from({length: 6}).map((_, i) => (
                            <div key={i} className="flex-grow bg-surface-container-high h-8 rounded-t-lg opacity-20"></div>
                        ))}
                    </div>
                </div>
                
                {/* Top Favorites from Statistics list Style */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 h-[480px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Sản phẩm yêu thích</h2>
                            <p className="text-xs text-secondary font-medium mt-1">Dựa trên danh sách Wishlist</p>
                        </div>
                        <Link to="/admin/statistics/wishlist" className="text-xs font-black text-primary hover:underline">Xem hết</Link>
                    </div>
                    
                    <div className="space-y-4 flex-grow overflow-y-auto pr-1 no-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <span className="animate-spin material-symbols-outlined text-primary">sync</span>
                            </div>
                        ) : wishlistStats.length > 0 ? wishlistStats.map((item, index) => (
                            <div key={item.product_id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-container-low transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={getImageURL(item.images?.[0])} 
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-xl shadow-md group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <span className="absolute -top-2 -left-2 w-6 h-6 bg-white shadow-md text-primary text-[10px] flex items-center justify-center rounded-full font-black italic">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-on-surface truncate max-w-[140px]">{item.name}</p>
                                        <p className="text-[10px] text-outline font-bold mt-0.5">{(item.price || 0).toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-primary">
                                        <span className="text-sm font-black italic">{item.count}</span>
                                        <span className="material-symbols-outlined text-[14px]">favorite</span>
                                    </div>
                                    <span className="text-[8px] font-black text-outline uppercase tracking-tighter">Lượt thích</span>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-40">
                                <span className="material-symbols-outlined text-4xl mb-2">heart_broken</span>
                                <p className="text-xs font-bold">Chưa có dữ liệu yêu thích</p>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => navigate('/admin/products')}
                        className="w-full mt-6 py-4 rounded-2xl bg-surface-container-low text-xs font-black text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        Quản lý trong kho
                    </button>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <section className="mt-12 text-left pb-12">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-outline">Giao dịch gần đây</h4>
                    <Link 
                        to="/admin/orders" 
                        className="text-xs font-black text-primary flex items-center gap-1.5 hover:gap-2 transition-all"
                    >
                        Quản lý đơn hàng
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                
                <div className="bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-sm border border-outline-variant/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-surface-container-low/50 border-b border-outline-variant/5">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-secondary tracking-widest uppercase">Mã đơn</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-secondary tracking-widest uppercase">Khách hàng</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-secondary tracking-widest uppercase">Sản phẩm</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-secondary tracking-widest uppercase">Trạng thái</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-secondary tracking-widest uppercase">Thanh toán</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-secondary tracking-widest uppercase text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <span className="animate-spin material-symbols-outlined text-primary">sync</span>
                                        </td>
                                    </tr>
                                ) : latestOrders.length > 0 ? latestOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-surface-container-lowest transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center overflow-hidden">
                                                    {order.user_id?.avatar ? (
                                                        <img src={getImageURL(order.user_id.avatar)} className="w-full h-full object-cover" alt={order.user_id.name} />
                                                    ) : (
                                                        <span className="text-xs font-black text-primary">{(order.user_id?.name || 'U')[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-on-surface">{order.user_id?.name || 'Khách vãng lai'}</p>
                                                    <p className="text-[10px] text-outline font-medium mt-0.5">{order.user_id?.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-on-surface">
                                            {order.items_count || 1} sản phẩm
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                                order.status === 'pending' ? 'bg-orange-50 text-orange-700' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                'bg-blue-50 text-blue-700'
                                            }`}>
                                                {order.status === 'pending' ? 'Chờ xác nhận' :
                                                 order.status === 'delivered' ? 'Hoàn tất' :
                                                 order.status === 'cancelled' ? 'Đã hủy' : 'Đang giao'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-on-surface">{(order.total_price || 0).toLocaleString()}đ</p>
                                            <p className="text-[10px] text-outline font-bold uppercase mt-0.5">{order.payment_method}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => navigate('/admin/orders')}
                                                className="w-10 h-10 rounded-xl bg-surface-container-low hover:bg-primary hover:text-white text-on-surface-variant transition-all flex items-center justify-center group-hover:scale-105"
                                            >
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-sm font-bold text-outline uppercase tracking-widest">Chưa có giao dịch gần đây</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

export default AdminDashboard;
