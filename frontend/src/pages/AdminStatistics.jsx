import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import { getImageURL } from '../utils/imageUtils';

const AdminStatistics = () => {
    const [wishlistStats, setWishlistStats] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [latestOrders, setLatestOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch wishlist stats
                const resWishlist = await api.get('/admin/stats/wishlist');
                if (resWishlist.data.success) {
                    setWishlistStats(resWishlist.data.data);
                }
                
                // Fetch general dashboard stats
                const resDashboard = await api.get('/orders/dashboard');
                setDashboardStats(resDashboard.data);

                // Fetch latest orders
                const resOrders = await api.get('/orders/all');
                setLatestOrders(resOrders.data.slice(0, 5)); // Just take top 5
            } catch (err) {
                console.error('Fetch Stats Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);


    const handleExport = (type = 'txt') => {
        if (!wishlistStats.length) return;
        const timestamp = new Date().toLocaleString('vi-VN');
        const filename = `Thong_ke_LuminaMobile_${new Date().getTime()}`;

        if (type === 'pdf') {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('BÁO CÁO THỐNG KÊ CHI TIẾT', 105, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Ngày xuất: ${timestamp}`, 105, 22, { align: 'center' });

            const data = wishlistStats.map((item, idx) => [
                idx + 1,
                item.name,
                item.product_id,
                `${item.price.toLocaleString()}đ`,
                `${item.count} lượt`
            ]);

            doc.autoTable({
                startY: 30,
                head: [['STT', 'Tên sản phẩm', 'Mã sản phẩm', 'Giá', 'Yêu thích']],
                body: data,
                headStyles: { fillColor: [0, 62, 199] }
            });

            doc.save(`${filename}.pdf`);
            return;
        }

        let content = `BÁO CÁO THỐNG KÊ CHI TIẾT - ${timestamp}\n`;
        content += `===========================================\n\n`;
        content += `TOP SẢN PHẨM ĐƯỢC YÊU THÍCH (WISHLIST):\n`;
        content += `-------------------------------------------\n`;
        wishlistStats.forEach((item, idx) => {
            content += `${idx + 1}. ${item.name}\n`;
            content += `   Mã SP: ${item.product_id}\n`;
            content += `   Giá: ${item.price.toLocaleString()} VNĐ\n`;
            content += `   Lượt thích: ${item.count}\n`;
            content += `-------------------------------------------\n`;
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
            title="Thống kê & Phân tích"
            subtitle="Báo cáo hệ thống và hiệu suất tổng quan."
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
                    <p className="text-secondary text-sm font-medium mb-1">Doanh thu hôm nay</p>
                    <h3 className="text-2xl font-bold text-on-surface">{(dashboardStats?.revenueToday || 0).toLocaleString()}đ</h3>
                    <p className="text-[10px] text-outline mt-3 uppercase tracking-wider">Lợi nhuận gộp từ đơn hàng</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <span className="material-symbols-outlined text-purple-700">ads_click</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Khách hàng hoạt động</p>
                    <h3 className="text-2xl font-bold text-on-surface">{(dashboardStats?.activeCustomers || 0).toLocaleString()}</h3>
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
                    <p className="text-secondary text-sm font-medium mb-1">Tổng số đơn hàng</p>
                    <h3 className="text-2xl font-bold text-on-surface">{(dashboardStats?.totalOrders || 0).toLocaleString()}</h3>
                    <p className="text-[10px] text-outline mt-3 uppercase tracking-wider">Hệ thống ghi nhận</p>
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
                    
                    {/* Real Chart Visualization from Database */}
                    <div className="relative w-full flex-grow flex items-end justify-between px-2 pt-4">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                        </div>
                        
                        {dashboardStats?.monthlyRevenue?.length > 0 ? (
                            dashboardStats.monthlyRevenue.map((item, idx) => {
                                const maxVal = Math.max(...dashboardStats.monthlyRevenue.map(m => m.total), 1);
                                const heightPercent = Math.max((item.total / maxVal) * 90, 5); // at least 5% height
                                return (
                                    <div key={idx} className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                                        <div className="bg-primary/10 w-full h-[80%] rounded-t-lg absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div 
                                            className="bg-primary w-full rounded-t-lg relative z-10 hover:opacity-80 transition-all duration-700 shadow-lg shadow-primary/10"
                                            style={{ height: `${heightPercent}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                {item.total.toLocaleString()}đ
                                            </div>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full font-bold">Tháng {item.month}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary text-sm italic">
                                Chưa có dữ liệu doanh thu tháng
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Wishlist Products */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 h-[450px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="text-lg font-bold mb-1">Top yêu thích</h4>
                                <p className="text-xs text-secondary">Sản phẩm trong danh sách Wishlist</p>
                            </div>
                            <Link to="/admin/statistics/wishlist" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline group">
                                Xem tất cả
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </Link>
                        </div>
                    
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <span className="animate-spin material-symbols-outlined text-primary text-2xl">sync</span>
                            </div>
                        ) : wishlistStats.length > 0 ? (
                            wishlistStats.map((item, index) => (
                                <div key={item.product_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img 
                                                src={item.images && item.images[0] ? getImageURL(item.images[0]) : ''} 
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                            />
                                            <span className="absolute -top-2 -left-2 w-5 h-5 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate max-w-[120px]">{item.name}</p>
                                            <p className="text-[10px] text-secondary font-medium">{item.price.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-extrabold text-primary">{item.count}</span>
                                        <span className="text-[10px] text-outline font-bold uppercase tracking-tighter">Lượt thích</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-secondary text-sm">
                                Chưa có dữ liệu yêu thích.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section className="mt-12 text-left">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-outline">Giao dịch gần đây</h4>
                    <Link to="/admin/orders" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline group">
                        Xem đơn hàng
                        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </Link>
                </div>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-secondary">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : latestOrders.length > 0 ? (
                                    latestOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-primary">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed overflow-hidden">
                                                        {order.user_id?.avatar ? (
                                                            <img src={getImageURL(order.user_id.avatar)} className="w-full h-full object-cover" alt={order.user_id.name} />
                                                        ) : (
                                                            (order.user_id?.name || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium">{order.user_id?.name || 'Khách vãng lai'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface">
                                                Đơn hàng {order._id.slice(-4)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">{(order.total_price || 0).toLocaleString()}đ</td>
                                            <td className="px-6 py-4">
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-secondary">Chưa có giao dịch nào.</td>
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

export default AdminStatistics;