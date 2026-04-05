import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getImageURL } from '../utils/imageUtils';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/reviews/all');
                setReviews(res.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Không thể tải danh sách đánh giá.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xoá đánh giá này?')) return;

        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews((prev) => prev.filter((review) => review._id !== reviewId));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Xoá đánh giá thất bại.');
        }
    };

    const handleExportReport = (type = 'txt') => {
        if (!reviews.length) return;
        const timestamp = new Date().toLocaleString('vi-VN');
        const filename = `Bao_cao_danh_gia_${new Date().getTime()}`;

        if (type === 'pdf') {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('BÁO CÁO ĐÁNH GIÁ SẢN PHẨM', 105, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Ngày xuất: ${timestamp}`, 105, 22, { align: 'center' });

            const tableData = reviews.map((r, i) => [
                i + 1,
                r.product_id?.name || 'N/A',
                r.user_id?.name || 'N/A',
                r.rating,
                r.comment,
                new Date(r.createdAt).toLocaleDateString('vi-VN')
            ]);

            doc.autoTable({
                startY: 30,
                head: [['STT', 'Sản phẩm', 'Người đánh giá', 'Rating', 'Bình luận', 'Ngày']],
                body: tableData,
                headStyles: { fillColor: [0, 62, 199] }
            });

            doc.save(`${filename}.pdf`);
            return;
        }

        let content = `BÁO CÁO ĐÁNH GIÁ SẢN PHẨM - ${timestamp}\n`;
        content += `-------------------------------------------\n`;
        content += `Tổng số đánh giá: ${reviews.length}\n`;
        content += `Điểm trung bình: ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} / 5\n\n`;
        
        reviews.forEach((r, i) => {
            content += `${i+1}. [${r.rating}/5] ${r.product_id?.name || 'N/A'} - Guest: ${r.user_id?.name || 'Unknown'}\n`;
            content += `   | Nội dung: ${r.comment}\n`;
            content += `   | Ngày: ${new Date(r.createdAt).toLocaleDateString('vi-VN')}\n\n`;
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
            title="Quản lý Đánh giá"
            subtitle="Xem xét các bình luận và xoá những nội dung không phù hợp"
        >
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-surface-container-high/80 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-on-surface">Danh sách đánh giá</h2>
                        <p className="text-sm text-secondary mt-1">Tất cả nhận xét do người dùng gửi.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="px-6 py-10 text-center text-secondary">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="px-6 py-10 text-center text-error-container text-on-error-container">{error}</div>
                ) : reviews.length === 0 ? (
                    <div className="px-6 py-10 text-center text-secondary">Chưa có đánh giá nào.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Sản phẩm</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Người đánh giá</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Rating</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Nội dung</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Ngày</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">
                                    {reviews.map((review) => (
                                        <tr key={review._id} className="group hover:bg-surface-container-low/30 transition-colors">
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/10">
                                                        {review.product_id?.images?.[0] ? (
                                                            <img src={getImageURL(review.product_id.images[0])} alt={review.product_id.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-outline text-xl">image</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-on-surface line-clamp-1">{review.product_id?.name || 'Sản phẩm đã xoá'}</div>
                                                        <div className="text-[10px] font-bold text-secondary tracking-widest uppercase mt-0.5">ID: {review.product_id?._id?.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs overflow-hidden">
                                                        {review.user_id?.avatar ? (
                                                            <img src={getImageURL(review.user_id.avatar)} alt={review.user_id.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            review.user_id?.name?.charAt(0) || 'U'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-on-surface">{review.user_id?.name || 'Người dùng'}</div>
                                                        <div className="text-[11px] text-secondary">{review.user_id?.email || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex items-center gap-0.5 text-amber-400">
                                                    <span className="text-sm font-black mr-1">{review.rating}</span>
                                                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <div className="max-w-md">
                                                    <p className="text-sm text-on-surface leading-snug">{review.comment}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top text-xs font-medium text-secondary">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-5 align-top text-right">
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="inline-flex items-center gap-2 rounded-full bg-error-container px-4 py-2 text-sm font-semibold text-on-error-container hover:bg-error/90 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminReviews;
