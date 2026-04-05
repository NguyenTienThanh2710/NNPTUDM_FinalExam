import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageURL } from '../utils/imageUtils';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);
  return (
    <main className="pt-20">
      {/* Khu vực nổi bật */}
      <section className="relative overflow-hidden min-h-[870px] flex items-center bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed rounded-full font-label">BẢN TITANIUM MỚI</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6 leading-tight font-headline">
              iPhone 15 Pro.<br />
              <span className="text-gradient">Rèn từ ánh sáng.</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-10 max-w-lg leading-relaxed">
              Chiếc iPhone đầu tiên với thiết kế titanium chuẩn hàng không vũ trụ, sử dụng hợp kim tương tự như trên tàu vũ trụ cho các nhiệm vụ lên Sao Hỏa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products" className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg transition-all hover:shadow-primary/20 active:scale-95 text-center">
                Mua ngay
              </Link>
              <Link to="/products" className="px-10 py-5 bg-surface-container-high text-on-surface font-bold rounded-xl transition-all hover:bg-surface-variant active:scale-95 text-center">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center md:justify-end">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-[100px]"></div>
            <img alt="Điện thoại flagship" className="relative z-10 w-full max-w-md md:max-w-lg drop-shadow-2xl translate-x-12 translate-y-8 rotate-3 scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAho8gCR3xBVtWF_OBl918B3OBX18-IOy9rmiB6q_jXt8IWNRJRRZWQpTQpQB1wDBWGZcKby57Z8xmpCs9B7tLuOL5HXB7_zfQElaxSri-l8DbCzdlxWvV8XEfWZKxqnbyUyxvw04bkAc3_R5U5esw48ISQOxePgujYhHm6_G4c9GLGUaO02oAntPWN-1QVCxO05jfGP_vvCYxyf59Yuk_Vjlkip25Y51AiHQ5zHqmwnWj_JxzTWfSgOzjXZAWgS4XqIju8IaV22A" />
          </div>
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Khám phá bộ sưu tập</h2>
            <p className="text-secondary mt-2">Tìm hệ sinh thái phù hợp nhất với nhu cầu của bạn.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">phone_iphone</span>
              <h3 className="text-xl font-bold mb-1">iPhone</h3>
              <p className="text-sm text-secondary">Hiệu năng mạnh mẽ, trải nghiệm mượt mà.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">apple</span>
            </div>
          </Link>
          
          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">ad_units</span>
              <h3 className="text-xl font-bold mb-1">Samsung</h3>
              <p className="text-sm text-secondary">Đổi mới trong từng thao tác.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">globe</span>
            </div>
          </Link>

          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">smartphone</span>
              <h3 className="text-xl font-bold mb-1">Oppo</h3>
              <p className="text-sm text-secondary">Bắt trọn mọi khoảnh khắc.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">lens_blur</span>
            </div>
          </Link>

          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">headphones</span>
              <h3 className="text-xl font-bold mb-1">Phụ kiện</h3>
              <p className="text-sm text-secondary">Hoàn thiện trải nghiệm của bạn.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">settings_input_hdmi</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Hàng mới về */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Hàng mới về</h2>
            <Link className="text-primary font-bold flex items-center gap-1 hover:underline" to="/products">
                Xem tất cả <span className="material-symbols-outlined text-lg">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-surface-container animate-pulse rounded-xl" />
              ))
            ) : newArrivals.length > 0 ? (
              newArrivals.map(product => (
                <Link key={product._id} to={`/products/${product._id}`} className="bg-surface-container-lowest rounded-xl p-6 group transition-all hover:shadow-2xl block">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-surface">
                    {product.stock < 5 && product.stock > 0 && (
                      <span className="absolute top-4 left-4 z-20 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest font-label">Sắp hết hàng</span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-4 left-4 z-20 bg-error text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest font-label">Hết hàng</span>
                    )}
                    <img alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" src={getImageURL(product.images?.[0])} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                         <span key={s} className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      ))}
                      <span className="text-[10px] font-bold text-secondary ml-1">({product.num_reviews || 0})</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-on-surface">{product.price?.toLocaleString()} ₫</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-secondary">Chưa có sản phẩm mới.</p>
            )}
          </div>
        </div>
      </section>

      {/* Bán chạy nhất - Dynamic Data from DB */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Gợi ý dành cho bạn</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
          {bestSellers[0] ? (
            <div className="md:col-span-8 bg-slate-900 rounded-3xl overflow-hidden relative flex flex-col justify-center p-12 text-white min-h-[400px]">
              <div className="relative z-10 max-w-sm">
                <span className="text-primary-fixed-dim text-xs font-bold tracking-widest font-label uppercase">SẢN PHẨM NỔI BẬT</span>
                <h3 className="text-4xl font-black mt-4 mb-4 font-headline leading-tight">{bestSellers[0].name}</h3>
                <p className="text-slate-300 mb-8 line-clamp-3">{bestSellers[0].description || 'Trải nghiệm đỉnh cao công nghệ với thiết kế sang trọng và hiệu năng vượt trội.'}</p>
                <Link to={`/products/${bestSellers[0]._id}`} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all hover:bg-slate-200 inline-block">Mua ngay</Link>
              </div>
              <img alt={bestSellers[0].name} className="absolute -right-20 bottom-0 w-2/3 h-full object-contain pointer-events-none opacity-80" src={getImageURL(bestSellers[0].images?.[0])} />
            </div>
          ) : (
             <div className="md:col-span-8 bg-slate-900 rounded-3xl p-12 text-white min-h-[400px] flex items-center justify-center italic text-slate-500">Đang cập nhật sản phẩm nổi bật...</div>
          )}
          
          <div className="md:col-span-4 grid grid-rows-2 gap-8">
            {bestSellers[1] ? (
              <Link to={`/products/${bestSellers[1]._id}`} className="bg-surface-container-high rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden block">
                <div>
                  <h4 className="font-bold text-xl mb-1 truncate">{bestSellers[1].name}</h4>
                  <p className="text-secondary text-sm line-clamp-2">Công nghệ mới nhất, phong cách thời thượng.</p>
                </div>
                <img alt={bestSellers[1].name} className="w-32 self-end group-hover:scale-110 transition-transform object-contain aspect-square" src={getImageURL(bestSellers[1].images?.[0])} />
              </Link>
            ) : (
                <div className="bg-surface-container-high rounded-3xl p-8 flex items-center justify-center italic text-slate-400">Trống</div>
            )}

            {bestSellers[2] ? (
              <Link to={`/products/${bestSellers[2]._id}`} className="bg-primary-container rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden text-white block">
                <div>
                  <h4 className="font-bold text-xl mb-1 truncate">{bestSellers[2].name}</h4>
                  <p className="text-primary-fixed-dim text-sm line-clamp-2">Âm thanh thuần khiết, trải nghiệm hoàn hảo.</p>
                </div>
                <img alt={bestSellers[2].name} className="w-32 self-end group-hover:scale-110 transition-transform object-contain aspect-square" src={getImageURL(bestSellers[2].images?.[0])} />
              </Link>
            ) : (
                <div className="bg-primary-container rounded-3xl p-8 flex items-center justify-center italic text-blue-300">Trống</div>
            )}
          </div>
        </div>
      </section>

      {/* Đăng ký nhận tin */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-surface-container-highest rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 border-4 border-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-primary rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-on-surface mb-6 font-headline tracking-tight">Luôn dẫn đầu xu hướng.</h2>
            <p className="text-secondary mb-10 text-lg">Đăng ký nhận tin để cập nhật sớm các đợt mở bán, ưu đãi độc quyền và thông tin công nghệ.</p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-grow px-6 py-4 bg-white border-none rounded-xl text-on-surface focus:ring-2 focus:ring-primary shadow-sm" placeholder="Nhập email của bạn" type="email" />
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/20">
                Đăng ký
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-6 font-medium">Khi đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
