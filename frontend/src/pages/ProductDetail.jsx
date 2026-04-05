import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import wishlistService from '../services/wishlist.service';
import { getImageURL } from '../utils/imageUtils';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [notice, setNotice] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [_hasReviewed, setHasReviewed] = useState(false);
    const [_reviewStatus, setReviewStatus] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/product/${id}`);
                setReviews(res.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        const fetchWishlistStatus = async () => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                try {
                    const res = await wishlistService.checkInWishlist(id);
                    setIsInWishlist(res.isInWishlist);
                } catch (err) {
                    console.error('Error checking wishlist status:', err);
                }
            }
        };

        const fetchReviewPermission = async () => {
            const token = localStorage.getItem('token');
            if (!token || token === 'null' || token === 'undefined') {
                setCanReview(false);
                setHasReviewed(false);
                setReviewStatus('Vui lòng đăng nhập để đánh giá sản phẩm.');
                return;
            }

            try {
                const res = await api.get(`/reviews/can-review/${id}`);
                setCanReview(res.data.canReview);
                setHasReviewed(res.data.alreadyReviewed);
                setReviewStatus(res.data.message);
            } catch (err) {
                console.error('Error checking review permission:', err);
                setCanReview(false);
                setReviewStatus(err.response?.data?.message || 'Không thể kiểm tra quyền đánh giá.');
            }
        };

        const fetchRelatedProducts = async (catId) => {
            try {
                const res = await api.get('/products');
                // Filter products in the same category, excluding current product
                const related = res.data.filter(p => (p.category_id?._id === catId || p.category_id === catId) && p._id !== id).slice(0, 4);
                setRelatedProducts(related);
            } catch (err) {
                console.error('Error fetching related products:', err);
            }
        };

        const loadData = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                fetchRelatedProducts(res.data.category_id?._id || res.data.category_id);
            } catch (_err) {
                setError('Không thể lấy thông tin sản phẩm');
            }
        };

        loadData();
        fetchReviews();
        fetchWishlistStatus();
        fetchReviewPermission();
    }, [id]);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await api.post('/cart', {
                product_id: id,
                quantity: quantity
            });
            navigate('/cart', { state: { notice: { type: 'success', text: 'Đã thêm sản phẩm vào giỏ hàng!' } } });
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login', { state: { notice: { type: 'info', text: 'Vui lòng đăng nhập để thêm vào giỏ hàng' } } });
                return;
            }
            setNotice({ type: 'error', text: err.response?.data?.message || 'Thêm vào giỏ hàng thất bại' });
        } finally {
            setAdding(false);
        }
    };

    const handleToggleWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            navigate('/login', { state: { notice: { type: 'info', text: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích!' } } });
            return;
        }

        try {
            const res = await wishlistService.toggleWishlist(id);
            setIsInWishlist(res.isWishlisted);
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            navigate('/login', { state: { notice: { type: 'info', text: 'Vui lòng đăng nhập để đánh giá sản phẩm!' } } });
            return;
        }

        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                product_id: id,
                rating: newRating,
                comment: newComment
            });
            
            setNotice({ type: 'success', text: 'Đã gửi đánh giá của bạn!' });
            setNewRating(5);
            setNewComment('');
            setCanReview(false);
            setHasReviewed(true);
            setReviewStatus('Bạn đã đánh giá sản phẩm này rồi.');
            
            // Re-fetch product and reviews to update the average rating
            const [prodRes, revRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/reviews/product/${id}`)
            ]);
            setProduct(prodRes.data);
            setReviews(revRes.data);
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Gửi đánh giá thất bại' });
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xoá đánh giá này?')) return;

        try {
            await api.delete(`/reviews/${reviewId}`);
            setNotice({ type: 'success', text: 'Đã xoá đánh giá!' });
            
            // Re-fetch product and reviews to update the average rating
            const [prodRes, revRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/reviews/product/${id}`)
            ]);
            setProduct(prodRes.data);
            setReviews(revRes.data);
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Xoá đánh giá thất bại' });
        }
    };

    if (error) {
        return (
            <main className="pt-24 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
                <div className="p-6 bg-error-container text-on-error-container rounded-xl">{error}</div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="pt-24 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
                Đang tải...
            </main>
        );
    }

    const categoryId = typeof product.category_id === 'string' ? product.category_id : product.category_id?._id;
    const currentUser = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (_err) {
            return null;
        }
    })();
    const isAdminViewer = currentUser?.role === 'ADMIN';

    return (
        <main className="pt-24 max-w-7xl mx-auto px-6 min-h-screen">
            {notice && (
                <div className={`fixed top-24 right-6 z-50 max-w-sm w-[min(380px,calc(100vw-48px))] rounded-2xl px-4 py-3 shadow-xl border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-lg">
                            {notice.type === 'success' ? 'check_circle' : notice.type === 'error' ? 'error' : 'info'}
                        </span>
                        <p className="text-sm font-semibold leading-snug">{notice.text}</p>
                        <button type="button" onClick={() => setNotice(null)} className="ml-auto text-on-surface-variant hover:opacity-80">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>
            )}
            {product.is_visible === false && isAdminViewer && (
                <div className="mb-6 rounded-xl px-4 py-3 border bg-slate-100 text-slate-800 border-slate-200">
                    <p className="text-sm font-bold">Sản phẩm này đang ở trạng thái ẩn tạm.</p>
                </div>
            )}
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-outline">
                <Link to="/products" className="hover:text-primary transition-colors">Cửa hàng</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link
                    to={categoryId ? `/products?category=${categoryId}` : '/products'}
                    className="hover:text-primary transition-colors"
                >
                    {product.category_id?.name || 'Danh mục'}
                </Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-on-surface">{product.name}</span>
            </nav>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                {/* Left Column: Gallery */}
                <div className="space-y-6">
                    <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center p-12 relative group ring-1 ring-outline/10">
                        {product.images && product.images.length > 0 ? (
                            <img alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" src={getImageURL(product.images[0])} />
                        ) : (
                            <div className="text-outline">Chưa có ảnh</div>
                        )}
                        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">Hàng mới về</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images && product.images.slice(0, 3).map((img, idx) => (
                            <button key={idx} className={`aspect-square bg-surface-container-low rounded-xl p-2 overflow-hidden ${idx === 0 ? 'border-2 border-primary' : 'hover:bg-surface-container transition-colors'}`}>
                                <img className="w-full h-full object-contain" src={getImageURL(img)} alt={`Ảnh nhỏ ${idx + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="flex flex-col text-left">
                    <div className="mb-2">
                        <span className="text-xs font-bold tracking-widest text-primary uppercase">{product.brand_id?.name || 'Thương hiệu'}</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-on-surface mb-4 leading-tight">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star}
                                    className="material-symbols-outlined text-sm" 
                                    style={{
                                        fontVariationSettings: `'FILL' ${product.avg_rating >= star ? 1 : (product.avg_rating >= star - 0.5 ? 0.5 : 0)}`
                                    }}
                                >
                                    {product.avg_rating >= star ? 'star' : (product.avg_rating >= star - 0.5 ? 'star_half' : 'star')}
                                </span>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-outline">{product.num_reviews || 0} đánh giá</span>
                        <span className="text-outline">|</span>
                        <span className="text-sm font-medium text-primary">Còn hàng ({product.stock})</span>
                    </div>
                    <div className="text-3xl font-bold text-on-surface mb-6">
                        {product.price.toLocaleString()} VNĐ
                    </div>

                    <p className="text-sm text-secondary mb-8 leading-relaxed max-w-lg">
                        {product.description || 'Sản phẩm tuyệt vời với các tính năng vượt trội, mang đến trải nghiệm đỉnh cao cho người sử dụng, phù hợp với mọi nhu cầu trong công việc và giải trí.'}
                    </p>

                    {/* Quantity Selection */}
                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">Số lượng</h3>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                            >
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button 
                            onClick={handleAddToCart}
                            disabled={adding || product.stock === 0}
                            className="py-5 px-8 bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {adding ? (
                                'Đang xử lý...'
                            ) : product.stock === 0 ? (
                                'Hết hàng'
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    Thêm vào giỏ
                                </>
                            )}
                        </button>

                        <button 
                            onClick={handleToggleWishlist}
                            title={(!localStorage.getItem('token') || localStorage.getItem('token') === 'null') ? "Đăng nhập để yêu thích" : ""}
                            className={`py-5 px-8 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border-2 shadow-sm ${isInWishlist ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50'}`}
                        >
                            <span 
                                className={`material-symbols-outlined text-xl ${isInWishlist ? 'fill-current' : ''}`}
                                style={isInWishlist ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                favorite
                            </span>
                            {isInWishlist ? 'Đã thích' : 'Yêu thích'}
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 p-4 bg-surface-container-low rounded-xl">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            <span className="text-xs font-medium">Giao hàng miễn phí*</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">verified_user</span>
                            <span className="text-xs font-medium">Bảo hành chính hãng 1 năm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">replay</span>
                            <span className="text-xs font-medium">Đổi trả 30 ngày</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Tabs Section */}
            <section className="border-t border-surface-container pt-16 mb-20 text-left">
                <div className="flex gap-8 lg:gap-12 border-b border-surface-container mb-12 overflow-x-auto no-scrollbar">
                    <button className="pb-4 text-lg font-bold text-primary border-b-2 border-primary whitespace-nowrap">Đặc điểm kỹ thuật</button>
                    <button className="pb-4 text-lg font-semibold text-outline hover:text-on-surface transition-colors whitespace-nowrap">Đánh Giá Từ Khách Hàng (1,240)</button>
                    <button className="pb-4 text-lg font-semibold text-outline hover:text-on-surface transition-colors whitespace-nowrap">Sản Phẩm Tương Tự</button>
                </div>
                
                {/* Specs Grid (Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-8 bg-surface-container-low rounded-xl space-y-4">
                        <span className="material-symbols-outlined text-primary text-3xl">memory</span>
                        <h4 className="text-xl font-bold">Vi xử lý tối tân</h4>
                        <p className="text-outline text-sm leading-relaxed">Hiệu năng mạnh mẽ với cấu trúc tiết kiệm năng lượng, xử lý mượt mà tác vụ hàng ngày và chơi game.</p>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white rounded-xl space-y-4">
                        <span className="material-symbols-outlined text-3xl">camera</span>
                        <h4 className="text-xl font-bold">Hệ thống Camera chuyên nghiệp</h4>
                        <p className="text-primary-fixed-dim text-sm leading-relaxed">Ghi lại khoảnh khắc rực rỡ với ống kính độ phân giải cao và tính năng chụp đêm hoàn thiện.</p>
                    </div>
                    <div className="p-8 bg-surface-container-low rounded-xl space-y-4">
                        <span className="material-symbols-outlined text-primary text-3xl">battery_charging_full</span>
                        <h4 className="text-xl font-bold">Sạc Nhanh Siêu Tốc</h4>
                        <p className="text-outline text-sm leading-relaxed">Từ 0-100% trong thời gian ngắn ngủi, giúp thiết bị luôn sẵn sàng đồng hành cùng bạn.</p>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="border-t border-outline-variant/30 pt-16 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Review Form */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-black text-on-surface mb-6">Đánh giá sản phẩm</h2>
                        {currentUser ? (
                            canReview ? (
                                <form onSubmit={handleSubmitReview} className="space-y-4 bg-surface-container-low p-6 rounded-2xl ring-1 ring-outline/10">
                                    <div>
                                        <label className="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wider">Xếp hạng</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    className={`material-symbols-outlined text-2xl transition-colors ${newRating >= star ? 'text-amber-400' : 'text-outline-variant'}`}
                                                    style={{ fontVariationSettings: `'FILL' ${newRating >= star ? 1 : 0}` }}
                                                >
                                                    star
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wider">Bình luận</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary min-h-[120px]"
                                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-surface-container-low p-6 rounded-2xl ring-1 ring-outline/10 text-center">
                                    <p className="text-sm text-secondary mb-4">Chỉ sau khi đơn hàng đang giao hoặc đã giao mới có thể đánh giá.</p>
                                </div>
                            )
                        ) : (
                            <div className="bg-surface-container-low p-6 rounded-2xl ring-1 ring-outline/10 text-center">
                                <p className="text-sm text-secondary mb-4">Vui lòng đăng nhập để đánh giá sản phẩm.</p>
                                <Link to="/login" className="text-primary font-bold hover:underline text-sm uppercase tracking-wider">Đăng nhập ngay</Link>
                            </div>
                        )}
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-on-surface">Nhận xét ({reviews.length})</h2>
                            <div className="flex items-center gap-2 text-sm font-bold text-on-surface bg-surface-container px-4 py-2 rounded-full">
                                <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                {product.avg_rating?.toFixed(1) || 0} / 5
                            </div>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
                                <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">rate_review</span>
                                <p className="text-secondary">Chưa có đánh giá nào cho sản phẩm này.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-surface-container-lowest p-6 rounded-2xl ring-1 ring-outline/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                    {review.user_id?.avatar ? (
                                                        <img src={review.user_id.avatar} alt={review.user_id.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-primary font-bold">{review.user_id?.name?.charAt(0) || 'U'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-on-surface text-sm">{review.user_id?.name || 'Người dùng'}</h4>
                                                    <p className="text-xs text-outline">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-amber-400">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className="material-symbols-outlined text-sm"
                                                        style={{ fontVariationSettings: `'FILL' ${review.rating >= star ? 1 : 0}` }}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-secondary leading-relaxed mb-4">{review.comment}</p>
                                        {(currentUser?._id === review.user_id?._id || isAdminViewer) && (
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="text-xs font-bold text-error hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-xs">delete</span>
                                                Xoá đánh giá
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="border-t border-outline-variant/30 pt-16 pb-24">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black text-on-surface">Sản phẩm liên quan</h2>
                        <Link to="/products" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p) => (
                            <Link key={p._id} to={`/products/${p._id}`} className="group block">
                                <div className="aspect-[4/5] bg-surface-container-lowest rounded-2xl overflow-hidden mb-4 ring-1 ring-outline-variant/10 group-hover:shadow-xl transition-all duration-500">
                                    <img 
                                        src={getImageURL(p.images?.[0]) || 'https://via.placeholder.com/300'} 
                                        alt={p.name} 
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                                    />
                                </div>
                                <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{p.name}</h3>
                                <p className="text-primary font-black mt-1">{p.price.toLocaleString()} VNĐ</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default ProductDetail;
