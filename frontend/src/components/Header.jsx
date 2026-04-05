import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const navItems = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Cửa hàng' },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [productIndex, setProductIndex] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const normalizeText = (value) => {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const queryText = useMemo(() => normalizeText(searchText), [searchText]);

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

  useEffect(() => {
    const fetchIndex = async () => {
      setSearchLoading(true);
      try {
        const res = await api.get('/products');
        const list = Array.isArray(res.data) ? res.data : [];
        setProductIndex(
          list.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            image: Array.isArray(p.images) ? p.images[0] : undefined,
            brandName: typeof p.brand_id === 'string' ? '' : p.brand_id?.name,
            categoryName: typeof p.category_id === 'string' ? '' : p.category_id?.name
          }))
        );
      } catch (_err) {
        setProductIndex([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchIndex();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current) return;
      if (searchRef.current.contains(e.target)) return;
      setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith('/products')) return;
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchText(q);
  }, [location.pathname, location.search]);

  const suggestions = useMemo(() => {
    if (!queryText) return [];
    const items = productIndex
      .map((p) => {
        const name = normalizeText(p.name);
        const brandName = normalizeText(p.brandName);
        const categoryName = normalizeText(p.categoryName);
        const score =
          (name.includes(queryText) ? 3 : 0) +
          (brandName.includes(queryText) ? 2 : 0) +
          (categoryName.includes(queryText) ? 1 : 0);
        return { ...p, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    return items.slice(0, 6);
  }, [productIndex, queryText]);

  const goSearch = (q) => {
    const trimmed = String(q || '').trim();
    if (!trimmed) {
      navigate('/products');
      setSearchOpen(false);
      return;
    }
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goSearch(searchText);
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
    setSearchOpen(true);
    if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = window.setTimeout(() => {
      setSearchOpen(true);
    }, 120);
  };

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
          <div className="relative hidden sm:block" ref={searchRef}>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input 
                className="bg-surface-container-highest border-none rounded-full pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary w-64 lg:w-80 transition-all shadow-sm" 
                placeholder="Tìm sản phẩm, thương hiệu..." 
                type="text" 
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setSearchOpen(true)}
              />
            </div>
            
            {searchOpen && (searchText.trim() || searchLoading) && (
              <div className="absolute top-full mt-3 w-80 lg:w-96 bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-outline-variant/20 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                {searchLoading ? (
                  <div className="p-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="p-3">
                    <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-outline">Gợi ý sản phẩm</p>
                    <div className="mt-1 space-y-1">
                      {suggestions.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            navigate(`/products/${p._id}`);
                            setSearchOpen(false);
                          }}
                          className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-colors text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/10">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform" />
                            ) : (
                              <span className="material-symbols-outlined text-outline">image</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{p.name}</p>
                            <p className="text-xs text-on-surface-variant font-medium">{p.price?.toLocaleString()} VNĐ</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => goSearch(searchText)}
                      className="w-full mt-2 py-3 border-t border-outline-variant/10 text-xs font-black text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-b-xl transition-colors"
                    >
                      XEM TẤT CẢ KẾT QUẢ CHO "{searchText}"
                    </button>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline mb-3">search_off</span>
                    <p className="text-sm font-bold text-on-surface-variant">Không tìm thấy sản phẩm nào</p>
                  </div>
                )}
              </div>
            )}
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
