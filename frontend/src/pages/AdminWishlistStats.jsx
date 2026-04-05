import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { getImageURL } from '../utils/imageUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';

const AdminWishlistStats = () => {
    const [wishlistStats, setWishlistStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats/wishlist');
                if (res.data.success) {
                    setWishlistStats(res.data.data);
                }
            } catch (err) {
                console.error('Fetch Wishlist Stats Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const filteredStats = wishlistStats.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = (type = 'pdf') => {
        if (!wishlistStats.length) return;
        const timestamp = new Date().toLocaleString('vi-VN');
        const filename = `Danh_sach_yeu_thich_LuminaMobile_${new Date().getTime()}`;

        if (type === 'pdf') {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('BÁO CÁO CHI TIẾT SẢN PHẨM ĐƯỢC YÊU THÍCH', 105, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Ngày xuất: ${timestamp}`, 105, 22, { align: 'center' });

            const data = wishlistStats.map((item, idx) => [
                idx + 1,
                item.name,
                item.product_id,
                `${item.price.toLocaleString()}đ`,
                item.count
            ]);

            doc.autoTable({
                startY: 30,
                head: [['STT', 'Tên sản phẩm', 'ID sản phẩm', 'Giá', 'Lượt yêu thích']],
                body: data,
                headStyles: { fillColor: [0, 62, 199] }
            });

            doc.save(`${filename}.pdf`);
            return;
        }

        let content = `DANH SÁCH SẢN PHẨM YÊU THÍCH - ${timestamp}\n`;
        content += `===========================================\n\n`;
        wishlistStats.forEach((item, idx) => {
            content += `${idx + 1}. ${item.name}\n`;
            content += `   ID: ${item.product_id}\n`;
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
            title="Chi tiết Sản phẩm Yêu thích"
            subtitle="Phân tích mức độ quan tâm của khách hàng đối với sản phẩm."
        >
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên sản phẩm hoặc ID..."
                        className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary h-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => handleExport('pdf')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        Xuất PDF
                    </button>
                    <button 
                        onClick={() => handleExport('txt')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold transition-all hover:bg-surface-variant active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm">description</span>
                        Xuất TXT
                    </button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-surface-container-low border-b border-surface-container-high">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Sản phẩm</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Giá</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Mức độ quan tâm</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <span className="animate-spin material-symbols-outlined text-primary text-4xl">sync</span>
                                    </td>
                                </tr>
                            ) : filteredStats.length > 0 ? (
                                filteredStats.map((item, index) => (
                                    <tr key={item.product_id} className="hover:bg-surface-container-low/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img 
                                                        src={item.images && item.images[0] ? getImageURL(item.images[0]) : ''} 
                                                        alt={item.name}
                                                        className="w-14 h-14 object-contain rounded-xl bg-surface p-1 border border-outline-variant/10"
                                                    />
                                                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-black border-2 border-white shadow-sm">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface line-clamp-1">{item.name}</p>
                                                    <p className="text-[10px] text-secondary font-mono">ID: {item.product_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black">{item.price.toLocaleString()}đ</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-2 max-w-[150px]">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs font-bold text-primary">{item.count}</span>
                                                    <span className="text-[10px] text-secondary font-bold uppercase">Lượt yêu thích</span>
                                                </div>
                                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-primary h-full rounded-full" 
                                                        style={{ width: `${Math.min((item.count / wishlistStats[0].count) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Link 
                                                to={`/products/${item.product_id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg transition-all hover:bg-primary hover:text-white group"
                                            >
                                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">visibility</span>
                                                Xem shop
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-sm text-secondary">
                                        Không tìm thấy dữ liệu phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminWishlistStats;
