import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (_err) {
                setError('Không thể lấy thông tin sản phẩm');
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await api.post('/cart', {
                product_id: id,
                quantity: quantity
            });
            alert('Đã thêm sản phẩm vào giỏ hàng!');
            navigate('/cart');
        } catch (err) {
            alert(err.response?.data?.message || 'Vui lòng đăng nhập để thêm vào giỏ hàng');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setAdding(false);
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

    return (
        <main className="pt-24 max-w-7xl mx-auto px-6 min-h-screen">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-outline">
                <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span>{product.category_id?.name || 'Danh mục'}</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-on-surface">{product.name}</span>
            </nav>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                {/* Left Column: Gallery */}
                <div className="space-y-6">
                    <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center p-12 relative group ring-1 ring-outline/10">
                        {product.images && product.images.length > 0 ? (
                            <img alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" src={product.images[0]} />
                        ) : (
                            <div className="text-outline">No Image</div>
                        )}
                        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">New Arrival</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images && product.images.slice(0, 3).map((img, idx) => (
                            <button key={idx} className={`aspect-square bg-surface-container-low rounded-xl p-2 overflow-hidden ${idx === 0 ? 'border-2 border-primary' : 'hover:bg-surface-container transition-colors'}`}>
                                <img className="w-full h-full object-contain" src={img} alt={`Thumbnail ${idx + 1}`} />
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
                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 0.5"}}>star_half</span>
                        </div>
                        <span className="text-sm font-medium text-outline">1,240 Reviews</span>
                        <span className="text-outline">|</span>
                        <span className="text-sm font-medium text-primary">In Stock ({product.stock})</span>
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
        </main>
    );
};

export default ProductDetail;
