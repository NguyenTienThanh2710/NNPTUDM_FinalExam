import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ProductList = () => {
    // Data states
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [search, setSearch] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceMax, setPriceMax] = useState(200000000);
    const [sort, setSort] = useState('popular');

    // Fetch Categories and Brands for the sidebar
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [brandRes, catRes] = await Promise.all([
                    api.get('/brands'),
                    api.get('/categories')
                ]);
                setBrands(brandRes.data);
                // We can also store categories if we want to add another filter section
            } catch (err) {
                console.error('Error fetching filters:', err);
            }
        };
        fetchFilters();
    }, []);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (search.trim()) params.keyword = search.trim();
            if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
            if (priceMax < 200000000) params.maxPrice = priceMax;
            if (sort !== 'popular') params.sort = sort;

            const res = await api.get('/products', { params });
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            setError('Không thể lấy danh sách sản phẩm. Vui lòng kiểm tra kết nối API.');
            setLoading(false);
        }
    }, [search, selectedBrands, priceMax, sort]);

    // Initial load
    useEffect(() => {
        fetchProducts();
    }, []); // eslint-disable-line

    const handleSearchClick = () => {
        fetchProducts();
    };

    const handleBrandToggle = (brandId) => {
        const newBrands = selectedBrands.includes(brandId) 
            ? selectedBrands.filter(id => id !== brandId) 
            : [...selectedBrands, brandId];
        setSelectedBrands(newBrands);
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedBrands([]);
        setPriceMax(200000000);
        setSort('popular');
        // Simple reload all
        api.get('/products').then(res => setProducts(res.data)).catch(console.error);
    };

    return (
        <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 min-h-screen text-left">
            <div className="flex flex-col md:flex-row gap-12">
                
                {/* Sidebar Filters */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="sticky top-28 space-y-10 bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-sm">
                        
                        {/* Search Section */}
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.2em] text-outline uppercase mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">search</span>
                                Tìm kiếm nhanh
                            </h3>
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="iPhone 15, S24..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                                    className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 pl-4 pr-10 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                                {search && (
                                    <button 
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Brand Section */}
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.2em] text-outline uppercase mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">branding_watermark</span>
                                Thương hiệu
                            </h3>
                            <div className="space-y-4">
                                {brands.map(brand => (
                                    <label key={brand._id} className="flex items-center group cursor-pointer">
                                        <div className="relative flex items-center">
                                            <input 
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand._id)}
                                                onChange={() => handleBrandToggle(brand._id)}
                                                className="peer w-6 h-6 rounded-lg border-2 border-slate-200 text-primary focus:ring-0 checked:border-primary transition-all appearance-none cursor-pointer"
                                            />
                                            <span className="material-symbols-outlined absolute inset-0 text-white text-base flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform pointer-events-none bg-primary rounded-lg font-bold">check</span>
                                        </div>
                                        <span className={`ml-4 text-sm font-bold transition-colors ${selectedBrands.includes(brand._id) ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                                            {brand.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Section */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-black tracking-[0.2em] text-outline uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">payments</span>
                                    Khoảng giá
                                </h3>
                                <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">MAX</span>
                            </div>
                            <div className="px-1">
                                <input 
                                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary" 
                                    max="200000000" 
                                    min="0" 
                                    step="1000000"
                                    type="range"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(Number(e.target.value))}
                                />
                                <div className="flex justify-between mt-4">
                                    <span className="text-[10px] font-bold text-slate-400">0đ</span>
                                    <span className="text-sm font-black text-primary">{(priceMax/1000000).toFixed(0)}tr VNĐ</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                            <button 
                                onClick={handleSearchClick}
                                className="w-full py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">search</span>
                                    Lọc sản phẩm
                                </span>
                            </button>
                            <button 
                                onClick={clearFilters}
                                className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Xóa tất cả lọc
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-on-surface">Khám Phá Sản Phẩm</h1>
                            <p className="text-on-surface-variant text-sm font-medium mt-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                Hiển thị {products.length} thiết bị phù hợp
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-2xl">
                            <span className="text-[10px] font-black text-outline uppercase ml-4 mr-2">Sắp xếp:</span>
                            <select 
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-white border-none text-xs font-bold rounded-xl pr-10 pl-4 py-2.5 focus:ring-4 focus:ring-primary/10 cursor-pointer shadow-sm"
                            >
                                <option value="popular">Phổ biến nhất</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-fade-in"><span className="material-symbols-outlined">error</span>{error}</div>}

                    {/* Product Grid / Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-pulse">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[3/4] bg-slate-100 rounded-3xl"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                    <div className="h-6 bg-slate-100 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {products.map((product) => (
                                <div className="group animate-fade-in" key={product._id}>
                                    <div className="relative aspect-[3/4] bg-white rounded-[40px] overflow-hidden mb-6 transition-all duration-700 shadow-sm hover:shadow-2xl hover:shadow-primary/10 border border-slate-50">
                                        {product.images && product.images.length > 0 ? (
                                            <img alt={product.name} className="w-full h-full object-contain p-8 transition-transform duration-1000 group-hover:scale-110" src={product.images[0]} />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><span className="material-symbols-outlined text-4xl">image</span></div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-white via-white/95 to-transparent">
                                            <Link to={`/products/${product._id}`} className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-xs tracking-widest uppercase">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="space-y-2 px-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.brand_id?.name || 'Brand'}</span>
                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                        </div>
                                        <h3 className="font-extrabold text-xl text-on-surface line-clamp-1 group-hover:text-primary transition-colors duration-300" title={product.name}>{product.name}</h3>
                                        <div className="flex items-center justify-between pt-1">
                                            <p className="text-xl font-black text-on-surface">{product.price.toLocaleString()} <span className="text-xs font-bold text-slate-400">₫</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center flex flex-col items-center bg-surface-container-lowest rounded-[48px] border border-dashed border-outline-variant/20 animate-fade-in">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-slate-300 text-5xl">search_off</span>
                            </div>
                            <h3 className="text-2xl font-black mb-2">Không tìm thấy sản phẩm nào.</h3>
                            <p className="text-slate-500 font-medium max-w-xs mx-auto">Bạn hãy thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm nhé.</p>
                            <button onClick={clearFilters} className="mt-8 px-8 py-3 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Xóa hết bộ lọc</button>
                        </div>
                    )}

                    {/* Pagination - Simplified for results count */}
                    {!loading && products.length > 0 && products.length >= 10 && (
                        <div className="mt-24 flex justify-center items-center gap-4">
                            <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-white hover:text-primary transition-all">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <span className="text-xs font-black text-primary bg-primary/5 px-4 py-2 rounded-xl">Page 1</span>
                            <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-white hover:text-primary transition-all">
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
