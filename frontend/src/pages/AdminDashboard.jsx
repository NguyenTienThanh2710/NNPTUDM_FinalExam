import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

                // Fetch latest orders
                const resOrders = await api.get('/orders/all');
                setLatestOrders(resOrders.data.slice(0, 5));
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


    const handleExportReport = (type = 'txt') => {
        if (!stats) return;
        
        const timestamp = new Date().toLocaleString('vi-VN');
        const filename = `Bao_cao_LuminaMobile_${new Date().getTime()}`;

        if (type === 'pdf') {
            const doc = new jsPDF();
            
            // Title
            doc.setFontSize(22);
            doc.text('BÁO CÁO TỔNG QUAN HỆ THỐNG', 105, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.text(`Thời gian: ${timestamp}`, 105, 30, { align: 'center' });
            
            // General Stats
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
            
            // Monthly Revenue
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
            
            // Top Products
            const finalY2 = doc.lastAutoTable.finalY + 15;
            doc.text('3. Top sản phẩm yêu thích (Wishlist):', 20, finalY2);
            
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
        content += `-------------------------------------------\n`;
        content += `Doanh thu hôm nay: ${stats.revenueToday?.toLocaleString()} VNĐ\n`;
        content += `Tổng đơn hàng: ${stats.totalOrders}\n`;
        content += `Sản phẩm sắp hết hàng: ${stats.lowStockCount}\n`;
        content += `Khách hàng hoạt động: ${stats.activeCustomers}\n\n`;
        
        content += `DOANH THU HÀNG THÁNG:\n`;
        monthly.forEach(m => {
            content += `- Tháng ${m.month}: ${m.total?.toLocaleString()} VNĐ\n`;
        });
        
        content += `\nSẢN PHẨM ĐƯỢC YÊU THÍCH NHẤT:\n`;
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
            title="Bảng điều khiển"
            actions={(
                <>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleExportReport('txt')}
                            className="bg-surface-container-high text-on-surface font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-80 transition-all duration-300 border border-outline-variant/10"
                            title="Xuất file TEXT"
                        >
                            <span className="material-symbols-outlined text-sm">description</span>
                            TEXT
                        </button>
                        <button 
                            onClick={() => handleExportReport('pdf')}
                            className="bg-surface-container-high text-on-surface font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-80 transition-all duration-300 border border-outline-variant/10"
                            title="Xuất file PDF"
                        >
                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                            PDF
                        </button>
                    </div>
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
                                            src={item.images && item.images[0] ? getImageURL(item.images[0]) : ''} 
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
                        onClick={() => navigate('/admin/statistics/wishlist')}
                        className="w-full mt-6 py-3 rounded-xl border border-outline-variant/20 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                    >
                        Xem tất cả số liệu
                    </button>
                </div>
            </div>

            {/* Latest Sales Feature */}
            <section className="mt-12 text-left pb-10">
                <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-6">Giao dịch gần đây</h4>
                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-surface-container-low border-b border-surface-container-high">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">MÃ ĐƠN</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">KHÁCH HÀNG</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">TRẠNG THÁI</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">GIÁ TRỊ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary text-right">THAO TÁC</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-secondary">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : latestOrders.length > 0 ? (
                                    latestOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="px-6 py-5 text-sm font-bold text-primary">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {(order.user_id?.name || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium">{order.user_id?.name || 'Khách vãng lai'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status === 'pending' ? 'Chờ xử lý' :
                                                     order.status === 'delivered' ? 'Hoàn tất' :
                                                     order.status === 'cancelled' ? 'Đã hủy' : 'Đang giao'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold">{(order.total_price || 0).toLocaleString()}đ</td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => navigate('/admin/orders')}
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-secondary">Chưa có giao dịch nào.</td>
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
