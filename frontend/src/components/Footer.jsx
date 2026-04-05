import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full mt-32 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-8 py-20 max-w-7xl mx-auto">
        <div className="space-y-8">
          <Link className="flex items-center gap-2 group" to="/">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Lumina</span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
            Nền tảng mua sắm công nghệ đỉnh cao, nơi mang đến cho bạn những thiết bị di động tiên tiến nhất thế giới với trải nghiệm mua sắm tuyệt vời.
          </p>
          <div className="flex gap-3">
            {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-lg">{social === 'facebook' ? 'language' : social === 'youtube' ? 'smart_display' : 'share'}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">Danh mục nổi bật</h5>
          <ul className="space-y-4">
            {['iPhone Series', 'Samsung Galaxy', 'Google Pixel', 'Phụ kiện cao cấp'].map((item) => (
              <li key={item}>
                <Link className="text-slate-500 dark:text-slate-400 hover:text-primary transition-all text-sm font-medium hover:translate-x-1 inline-block" to="/products">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">Hỗ trợ khách hàng</h5>
          <ul className="space-y-4">
            {['Chính sách bảo hành', 'Đổi trả trong 30 ngày', 'Giao hàng hỏa tốc', 'Hệ thống cửa hàng'].map((item) => (
              <li key={item}>
                <Link className="text-slate-500 dark:text-slate-400 hover:text-primary transition-all text-sm font-medium hover:translate-x-1 inline-block" to="#">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl space-y-6">
          <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Đăng ký bản tin</h5>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed"> Nhận ngay voucher 10% khi đăng ký nhận thông tin khuyến mãi mới nhất.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="w-full bg-white dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-xs focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            <button className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 border-t border-slate-100 dark:border-slate-800 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold tracking-wider uppercase">
          © 2026 Lumina Mobile. Designed with Passion.
        </p>
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
            <a key={item} href="#" className="text-slate-400 dark:text-slate-500 text-[11px] font-bold tracking-wider uppercase hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
