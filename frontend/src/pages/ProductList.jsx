import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import wishlistService from '../services/wishlist.service';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (_err) {
                setError('Không thể lấy danh sách sản phẩm');
            }
        };

        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await wishlistService.getWishlist();
                    setWishlistedIds(res.data.map(p => p._id));
                } catch (err) {
                    console.error('Error fetching wishlist:', err);
                }
            }
        };

        fetchProducts();
        fetchWishlist();
    }, []);

    const handleToggleWishlist = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await wishlistService.toggleWishlist(productId);
            if (res.isWishlisted) {
                setWishlistedIds([...wishlistedIds, productId]);
            } else {
                setWishlistedIds(wishlistedIds.filter(id => id !== productId));
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    };

    return (
        <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-28 space-y-10">
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">Brand</h3>
                            <div className="space-y-3">
                                <label className="flex items-center group cursor-pointer">
                                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all" type="checkbox" defaultChecked />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Apple</span>
                                </label>
                                <label className="flex items-center group cursor-pointer">
                                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all" type="checkbox" defaultChecked />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Samsung</span>
                                </label>
                                <label className="flex items-center group cursor-pointer">
                                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all" type="checkbox" />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Sony</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">Price Range</h3>
                            <div className="px-2">
                                <input className="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" max="200000000" min="0" type="range" />
                                <div className="flex justify-between mt-4">
                                    <span className="text-sm font-semibold text-on-surface-variant">0đ</span>
                                    <span className="text-sm font-semibold text-on-surface-variant">200tr</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">Storage</h3>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-2 text-xs font-bold rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white transition-all">128GB</button>
                                <button className="px-4 py-2 text-xs font-bold rounded-full bg-primary text-white transition-all">256GB</button>
                                <button className="px-4 py-2 text-xs font-bold rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white transition-all">512GB</button>
                                <button className="px-4 py-2 text-xs font-bold rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white transition-all">1TB</button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">RAM</h3>
                            <div className="space-y-3">
                                <label className="flex items-center group cursor-pointer">
                                    <input className="w-5 h-5 border-outline-variant text-primary focus:ring-primary/20 transition-all" name="ram" type="radio" />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant">8GB</span>
                                </label>
                                <label className="flex items-center group cursor-pointer">
                                    <input className="w-5 h-5 border-outline-variant text-primary focus:ring-primary/20 transition-all" name="ram" type="radio" defaultChecked />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant">12GB</span>
                                </label>
                                <label className="flex items-center group cursor-pointer">
                                    <input className="w-5 h-5 border-outline-variant text-primary focus:ring-primary/20 transition-all" name="ram" type="radio" />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant">16GB+</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-on-surface">Danh Sách Sản Phẩm</h1>
                            <p className="text-on-surface-variant text-sm mt-1">Showing {products.length} products</p>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-full">
                            <span className="text-xs font-bold text-outline uppercase ml-4 mr-2">Sort by:</span>
                            <select className="bg-surface-container-lowest border-none text-sm font-semibold rounded-full focus:ring-0 cursor-pointer pr-10 hover:bg-surface-container-high transition-colors">
                                <option>Most Popular</option>
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}

                    {/* Product Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {products.map((product) => (
                                <div className="group" key={product._id}>
                                    <div className="relative aspect-[3/4] bg-surface-container-lowest rounded-xl overflow-hidden mb-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ring-1 ring-outline/10">
                                        {product.images && product.images.length > 0 ? (
                                            <img alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={product.images[0]} />
                                        ) : (
                                            <div className="w-full h-full bg-surface flex items-center justify-center text-outline">No Image</div>
                                        )}
                                        
                                        {/* Wishlist Button */}
                                        <button 
                                            onClick={(e) => handleToggleWishlist(e, product._id)}
                                            className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
                                        >
                                            <span 
                                                className={`material-symbols-outlined text-xl transition-colors duration-300 ${wishlistedIds.includes(product._id) ? 'text-red-500 fill-current' : 'text-slate-400'}`}
                                                style={wishlistedIds.includes(product._id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                                            >
                                                favorite
                                            </span>
                                        </button>

                                        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <Link to={`/products/${product._id}`} className="w-full bg-white text-on-surface font-bold py-3 rounded-full flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.brand_id?.name || 'Brand'}</p>
                                        <h3 className="font-bold text-lg text-on-surface line-clamp-1" title={product.name}>{product.name}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xl font-black text-on-surface">{product.price.toLocaleString()} VNĐ</p>
                                            <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                4.9
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center border border-dashed border-outline-variant rounded-3xl">
                            <span className="material-symbols-outlined text-border text-6xl text-outline mb-4">inventory_2</span>
                            <h3 className="text-xl font-bold mb-2">Chưa có sản phẩm nào.</h3>
                            <p className="text-secondary">Sản phẩm sẽ sớm được cập nhật.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.length > 0 && (
                        <div className="mt-20 flex justify-center items-center gap-2">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-outline-variant border border-outline-variant hover:border-primary hover:text-primary transition-all">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-bold">1</button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high font-bold">2</button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-outline-variant border border-outline-variant hover:border-primary hover:text-primary transition-all">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProductList;
