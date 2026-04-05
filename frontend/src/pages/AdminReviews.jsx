import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

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
                                            <div className="text-sm font-semibold text-on-surface">{review.product_id?.name || 'Sản phẩm đã xoá'}</div>
                                            <div className="text-xs text-secondary mt-1">ID: {review.product_id?._id?.slice(-6)}</div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="text-sm font-semibold text-on-surface">{review.user_id?.name || 'Người dùng'}</div>
                                            <div className="text-xs text-secondary mt-1">{review.user_id?.email || 'Không có email'}</div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-sm font-semibold text-on-surface">{review.rating} / 5</span>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <p className="text-sm text-on-surface leading-relaxed">{review.comment}</p>
                                        </td>
                                        <td className="px-6 py-5 align-top text-sm text-secondary">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</td>
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
