import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featRes, newRes, catRes] = await Promise.all([
                    api.get('/products?featured=true&limit=8'), // Includes Hero + Best Sellers
                    api.get('/products?sort=newest&limit=4'),
                    api.get('/categories')
                ]);
                setFeaturedProducts(featRes.data);
                setNewArrivals(newRes.data);
                setCategories(catRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Lỗi tải dữ liệu trang chủ:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                <p className="text-secondary font-medium">Đang tải trải nghiệm của bạn...</p>
            </div>
        );
    }

    const heroProduct = featuredProducts[0] || newArrivals[0];
    const bestSellers = featuredProducts.slice(1, 5);

    return (
        <main className="pt-20">
            {/* Hero Section */}
            {heroProduct && (
                <section className="relative overflow-hidden min-h-[700px] flex items-center bg-surface-container-low transition-all duration-700">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div className="z-10 text-center md:text-left">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed rounded-full font-label">SIÊU PHẨM MỚI</span>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6 leading-tight font-headline">
                                {heroProduct.name.split(' ').slice(0, 2).join(' ')}.<br />
                                <span className="text-gradient font-black">{heroProduct.name.split(' ').slice(2).join(' ')}</span>
                            </h1>
                            <p className="text-lg md:text-xl text-secondary mb-10 max-w-lg leading-relaxed line-clamp-3">
                                {heroProduct.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link to={`/products/${heroProduct._id}`} className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg transition-all hover:shadow-primary/20 active:scale-95 text-center">
                                    Mua ngay
                                </Link>
                                <Link to="/products" className="px-10 py-5 bg-surface-container-high text-on-surface font-bold rounded-xl transition-all hover:bg-surface-variant active:scale-95 text-center">
                                    Khám phá thêm
                                </Link>
                            </div>
                        </div>
                        <div className="relative flex justify-center md:justify-end">
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-[100px]"></div>
                            <img alt={heroProduct.name} className="relative z-10 w-full max-w-md md:max-w-lg drop-shadow-2xl translate-x-4 md:translate-x-12 translate-y-8 rotate-3 scale-110 pointer-events-none hover:scale-115 transition-transform duration-700 h-[500px] object-contain" src={heroProduct.images[0]} />
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Bento */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Khám phá Danh mục</h2>
                        <p className="text-secondary mt-2">Tìm kiếm hệ sinh thái phù hợp với phong cách của bạn.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categories.map((cat, idx) => (
                        <Link key={cat._id} to={`/products?category=${cat._id}`} className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block h-full">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4">
                                    {cat.name.includes(' thoại') ? 'phone_iphone' : cat.name.includes('Laptop') ? 'laptop_mac' : cat.name.includes(' tính bảng') ? 'tablet_mac' : cat.name.includes('Đồng hồ') ? 'watch_smart' : 'headphones'}
                                </span>
                                <h3 className="text-lg font-bold mb-1 leading-tight">{cat.name}</h3>
                                <p className="text-xs text-secondary line-clamp-1">{cat.description}</p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <span className="material-symbols-outlined text-[120px]">category</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-24 bg-surface-container-low">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Sản phẩm mới nhất</h2>
                        <Link className="text-primary font-bold flex items-center gap-1 hover:underline text-sm" to="/products">
                            Xem tất cả <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newArrivals.map(prod => (
                            <Link key={prod._id} to={`/products/${prod._id}`} className="bg-surface-container-lowest rounded-2xl p-6 group transition-all hover:shadow-2xl flex flex-col h-full border border-outline-variant/5">
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-6 bg-surface p-4">
                                    <span className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest font-label">NEW</span>
                                    <img alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" src={prod.images[0]} />
                                </div>
                                <div className="space-y-2 flex-grow">
                                    <span className="text-[10px] font-bold text-outline tracking-wider uppercase">{prod.brand_id?.name}</span>
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{prod.name}</h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-outline-variant/5 flex items-center justify-between">
                                    <span className="text-xl font-black text-on-surface">{prod.price.toLocaleString()} ₫</span>
                                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">arrow_forward</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Picks / Best Sellers Banner */}
            {bestSellers.length > 0 && (
                <section className="py-24 max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Lựa chọn hàng đầu</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Featured Large Card */}
                        <div className="md:col-span-8 bg-slate-900 rounded-[40px] overflow-hidden relative flex flex-col justify-center p-8 md:p-16 text-white min-h-[450px] group">
                            <div className="relative z-10 max-w-sm">
                                <span className="text-primary-fixed-dim text-xs font-bold tracking-widest font-label uppercase">FEATURED PICK</span>
                                <h3 className="text-4xl md:text-5xl font-black mt-4 mb-4 font-headline leading-tight">
                                    {bestSellers[0].name.split(' ').slice(0,2).join(' ')}.<br />
                                    <span className="text-primary-fixed font-black">{bestSellers[0].name.split(' ').slice(2).join(' ')}</span>
                                </h3>
                                <p className="text-slate-400 mb-8 border-l-2 border-primary-fixed pl-4 font-medium italic">"{bestSellers[0].description.split('.')[0]}."</p>
                                <Link to={`/products/${bestSellers[0]._id}`} className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold transition-all hover:bg-primary-fixed hover:-translate-y-1 active:scale-95 inline-block shadow-xl">Mua ngay</Link>
                            </div>
                            <img alt={bestSellers[0].name} className="absolute -right-20 bottom-0 w-2/3 h-full object-contain pointer-events-none opacity-80 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-1000" src={bestSellers[0].images[0]} />
                        </div>

                        {/* Small Cards Column */}
                        <div className="md:col-span-4 grid grid-rows-2 gap-8">
                            {bestSellers.slice(1, 3).map((prod, idx) => (
                                <Link key={prod._id} to={`/products/${prod._id}`} className={`${idx === 1 ? 'bg-primary-container text-white' : 'bg-surface-container-high text-on-surface'} rounded-[32px] p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative shadow-sm hover:shadow-xl transition-all`}>
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-xl mb-1 line-clamp-1">{prod.name}</h4>
                                        <p className={`${idx === 1 ? 'text-primary-fixed-dim' : 'text-secondary'} text-sm line-clamp-1`}>{prod.description}</p>
                                    </div>
                                    <img alt={prod.name} className="w-32 h-32 object-contain self-end group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 absolute -bottom-2 -right-2" src={prod.images[0]} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-surface-container-highest rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden border border-outline-variant/10 shadow-2xl shadow-primary/5">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 border-[1px] border-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 border-[1px] border-primary rounded-full translate-x-1/2 translate-y-1/2"></div>
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Newsletter</span>
                        <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-6 font-headline tracking-tight">Stay ahead of the curve.</h2>
                        <p className="text-secondary mb-10 text-lg md:text-xl font-medium leading-relaxed">Join our inner circle for early access to drops, expert technical insights, and exclusive titanium-grade deals.</p>
                        <form className="flex flex-col sm:flex-row gap-4 p-2 bg-white/50 backdrop-blur-md rounded-2xl border border-outline-variant/20 shadow-inner" onSubmit={(e) => e.preventDefault()}>
                            <input className="flex-grow px-6 py-4 bg-transparent border-none rounded-xl text-on-surface focus:ring-0 placeholder:text-outline" placeholder="Enter your business email" type="email" />
                            <button className="px-10 py-4 bg-primary text-white font-bold rounded-xl transition-all hover:shadow-2xl hover:shadow-primary/30 active:scale-95">
                                Join now
                            </button>
                        </form>
                        <p className="text-[11px] text-outline mt-8 font-semibold tracking-wide">SHIPPING WORLDWIDE FROM THE TECH HUB. © 2026 LUMINA MOBILE.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
