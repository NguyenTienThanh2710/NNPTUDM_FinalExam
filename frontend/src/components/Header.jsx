import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Cửa hàng' },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user login status on mount and when localStorage changes
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Listen for storage changes in OTHER windows
    window.addEventListener('storage', checkUser);
    // Listen for custom event in CURRENT window
    window.addEventListener('authChange', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('authChange', checkUser);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    setIsLogoutConfirmOpen(false);
    setNotice({ type: 'success', text: 'Đăng xuất thành công' });
    window.setTimeout(() => navigate('/login'), 600);
  };

  return (
    <>
      {notice && (
        <div className="fixed left-1/2 top-1/2 z-[70] w-[min(380px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className={`pointer-events-auto w-full rounded-2xl px-4 py-3 shadow-xl border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
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
        </div>
      )}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6 py-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsLogoutConfirmOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-outline-variant/20 shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-black text-on-surface">Xác nhận đăng xuất</h3>
              <p className="mt-2 text-sm text-on-surface-variant">Bạn có chắc chắn muốn đăng xuất không?</p>
            </div>
            <div className="px-6 pb-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-50 font-headline" to="/">Lumina Mobile</Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <NavLink 
                key={item.to} 
                to={item.to}
                end={item.end}
                className={({isActive}) => isActive 
                  ? "text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 font-sans antialiased tracking-tight transition-all duration-300 hover:opacity-80" 
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 font-sans antialiased tracking-tight transition-all duration-300 hover:opacity-80"}
              >
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({isActive}) => isActive 
                  ? "text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 font-sans antialiased tracking-tight transition-all duration-300 hover:opacity-80" 
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 font-sans antialiased tracking-tight transition-all duration-300 hover:opacity-80"}
              >
                Quản trị
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64" placeholder="Tìm kiếm sản phẩm..." type="text" />
          </div>
          {user && (
            <Link to="/orders" className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:opacity-80 active:scale-95" title="Lịch sử đơn hàng">
              <span className="material-symbols-outlined">receipt_long</span>
            </Link>
          )}
          <Link to="/cart" className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:opacity-80 active:scale-95">
            <span className="material-symbols-outlined">shopping_cart</span>
          </Link>
          <Link to="/wishlist" className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:opacity-80 active:scale-95">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-outline-variant pl-4 ml-2">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-primary/20" />
                ) : (
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                )}
                <span className="text-sm font-bold text-on-surface hidden lg:block">{user.name}</span>
              </Link>
              <button 
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:text-red-500 active:scale-95 flex items-center gap-1"
                title="Đăng xuất"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:opacity-80 active:scale-95">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          )}
        </div>
      </div>
      </nav>
    </>
  );
}
