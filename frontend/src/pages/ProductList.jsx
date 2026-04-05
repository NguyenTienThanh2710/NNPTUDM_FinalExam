import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import wishlistService from '../services/wishlist.service';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [sortOption, setSortOption] = useState('popular');
    const [notice, setNotice] = useState(null);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [error, setError] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (_err) {
                setError('Không thể lấy danh sách sản phẩm');
            }
        };

        const fetchBrands = async () => {
            try {
                const res = await api.get('/brands');
                setBrands(res.data);
                setSelectedBrandIds(res.data.map((b) => b._id));
            } catch (_err) {
                setBrands([]);
                setSelectedBrandIds([]);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (_err) {
                setCategories([]);
            }
        };

        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                try {
                    const res = await wishlistService.getWishlist();
                    setWishlistedIds(res.data.map(p => p._id));
                } catch (err) {
                    console.error('Error fetching wishlist:', err);
                }
            }
        };

        fetchProducts();
        fetchBrands();
        fetchCategories();
        fetchWishlist();
    }, []);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            if (categories.some((c) => c._id === categoryParam)) {
                setSelectedCategoryId(categoryParam);
            }
        } else {
            setSelectedCategoryId('all');
        }
        setCurrentPage(1); // Reset page on category/search change
    }, [categories, searchParams]);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const handleSelectAllCategories = () => {
        setSelectedCategoryId('all');
        const next = new URLSearchParams(searchParams);
        next.delete('category');
        setSearchParams(next, { replace: true });
    };

    const handleSelectCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
        const next = new URLSearchParams(searchParams);
        next.set('category', categoryId);
        setSearchParams(next, { replace: true });
    };

    const handleToggleBrand = (brandId) => {
        setSelectedBrandIds((prev) => {
            if (prev.includes(brandId)) {
                return prev.filter((id) => id !== brandId);
            }
            return [...prev, brandId];
        });
    };

    const handleToggleWishlist = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        
        const token = localStorage.getItem('token');
        if (!token || token === 'null' || token === 'undefined') {
            navigate('/login', { state: { notice: { type: 'info', text: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích!' } } });
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

    const normalizeText = (value) => {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    };

    const queryText = normalizeText(searchParams.get('q'));

    const filteredProducts = products.filter((p) => {
        const searchTerm = searchParams.get('search')?.toLowerCase() || '';
        const isSearchMatch = !searchTerm || p.name.toLowerCase().includes(searchTerm

        const brandId = typeof p.brand_id === 'string' ? p.brand_id : p.brand_id?._id;
        const isBrandMatch = selectedBrandIds.length === 0 || (brandId && selectedBrandIds.includes(brandId));

        let isCategoryMatch = true;
        if (selectedCategoryId !== 'all') {
            const categoryId = typeof p.category_id === 'string' ? p.category_id : p.category_id?._id;
            isCategoryMatch = categoryId === selectedCategoryId;
        }

        const isPriceMatch = (!minPrice || p.price >= Number(minPrice)) && (!maxPrice || p.price <= Number(maxPrice));

        return isSearchMatch && isBrandMatch && isCategoryMatch && isPriceMatch;
    });

    const getObjectIdTime = (id) => {
        if (typeof id !== 'string' || id.length < 8) return 0;
        const seconds = Number.parseInt(id.slice(0, 8), 16);
        return Number.isFinite(seconds) ? seconds * 1000 : 0;
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'price_asc') return (a.price ?? 0) - (b.price ?? 0);
        if (sortOption === 'price_desc') return (b.price ?? 0) - (a.price ?? 0);
        if (sortOption === 'newest') return getObjectIdTime(b._id) - getObjectIdTime(a._id);
        return 0;
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const displayedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleClearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrandIds([]);
        setSelectedCategoryId('all');
        setSortOption('newest');
        setSearchParams({});
        setCurrentPage(1);
    };

    return (
        <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
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
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-28 space-y-10">
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">Thương hiệu</h3>
                            <div className="space-y-3">
                                {brands.map((brand) => (
                                    <label key={brand._id} className="flex items-center group cursor-pointer">
                                        <input
                                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all"
                                            type="checkbox"
                                            checked={selectedBrandIds.includes(brand._id)}
                                            onChange={() => handleToggleBrand(brand._id)}
                                        />
                                        <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">Danh mục</h3>
                            <div className="space-y-3">
                                <label className="flex items-center group cursor-pointer">
                                    <input
                                        className="w-5 h-5 border-outline-variant text-primary focus:ring-primary/20 transition-all"
                                        name="category"
                                        type="radio"
                                        checked={selectedCategoryId === 'all'}
                                        onChange={handleSelectAllCategories}
                                    />
                                    <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Tất cả</span>
                                </label>
                                {categories.map((category) => (
                                    <label key={category._id} className="flex items-center group cursor-pointer">
                                        <input
                                            className="w-5 h-5 border-outline-variant text-primary focus:ring-primary/20 transition-all"
                                            name="category"
                                            type="radio"
                                            checked={selectedCategoryId === category._id}
                                            onChange={() => handleSelectCategory(category._id)}
                                        />
                                        <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-outline uppercase mb-6">Khoảng giá</h3>
                            <div className="space-y-6">
                                {/* Quick Ranges */}
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Tất cả', min: '', max: '' },
                                        { label: 'Dưới 10tr', min: '0', max: '10000000' },
                                        { label: '10tr - 20tr', min: '10000000', max: '20000000' },
                                        { label: '20tr - 30tr', min: '20000000', max: '30000000' },
                                        { label: '30tr - 50tr', min: '30000000', max: '50000000' },
                                        { label: 'Trên 50tr', min: '50000000', max: '200000000' }
                                    ].map((range, idx) => {
                                        const isSelected = minPrice === range.min && (maxPrice === range.max || (range.max === '200000000' && maxPrice === '200000000'));
                                        return (
                                            <button 
                                                key={idx}
                                                onClick={() => {
                                                    setMinPrice(range.min);
                                                    setMaxPrice(range.max);
                                                    setCurrentPage(1);
                                                }}
                                                className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border ${isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container-high'}`}
                                            >
                                                {range.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Manual Input */}
                                <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-tighter">Hoặc nhập thủ công</p>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-full">
                                            <input 
                                                type="number" 
                                                placeholder="Từ" 
                                                className="w-full bg-surface-container-low border-none rounded-lg pl-3 pr-8 py-2 text-xs focus:ring-1 focus:ring-primary h-10"
                                                value={minPrice === '0' ? '' : minPrice}
                                                onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline opacity-40">đ</span>
                                        </div>
                                        <span className="text-outline text-xs">-</span>
                                        <div className="relative w-full">
                                            <input 
                                                type="number" 
                                                placeholder="Đến" 
                                                className="w-full bg-surface-container-low border-none rounded-lg pl-3 pr-8 py-2 text-xs focus:ring-1 focus:ring-primary h-10"
                                                value={maxPrice === '200000000' ? '' : maxPrice}
                                                onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline opacity-40">đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-4 border-t border-outline-variant/10">
                            <button 
                                onClick={handleClearFilters}
                                className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-500">restart_alt</span>
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-on-surface">Danh Sách Sản Phẩm</h1>
                            {queryText && (
                                <p className="mt-2 text-sm text-on-surface-variant">
                                    Kết quả tìm kiếm cho: <span className="font-bold text-on-surface">{searchParams.get('q')}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-full">
                            <span className="text-xs font-bold text-outline uppercase ml-4 mr-2">Sắp xếp:</span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-surface-container-lowest border-none text-sm font-semibold rounded-full focus:ring-0 cursor-pointer pr-10 hover:bg-surface-container-high transition-colors"
                            >
                                <option value="popular">Phổ biến nhất</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price_asc">Giá: Thấp đến cao</option>
                                <option value="price_desc">Giá: Cao đến thấp</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}

                    {/* Product Grid */}
                    {displayedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {displayedProducts.map((product) => (
                                <div className="group" key={product._id}>
                                    <div className="relative aspect-[3/4] bg-surface-container-lowest rounded-xl overflow-hidden mb-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ring-1 ring-outline/10">
                                        {product.images && product.images.length > 0 ? (
                                            <img alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={product.images[0]} />
                                        ) : (
                                            <div className="w-full h-full bg-surface flex items-center justify-center text-outline">Chưa có ảnh</div>
                                        )}

                                        {product.is_visible === false && (
                                            <>
                                                <div className="absolute inset-0 bg-black/55 z-[5]" />
                                                <div className="absolute top-4 left-4 z-[6] bg-slate-900/90 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                                                    Đã ẩn
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Wishlist Button */}
                                        <button 
                                            onClick={(e) => handleToggleWishlist(e, product._id)}
                                            title={(!localStorage.getItem('token') || localStorage.getItem('token') === 'null') ? "Đăng nhập để yêu thích" : ""}
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
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.brand_id?.name || 'Thương hiệu'}</p>
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
                    {totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-outline-variant border border-outline-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-outline-variant border border-outline-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
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
