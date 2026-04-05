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
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/20 dark:border-slate-800/50 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-10">
            <Link className="flex items-center gap-2 group" to="/">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Lumina</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  end={item.end}
                  className={({isActive}) => isActive 
                    ? "relative py-1 text-primary font-bold text-sm tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full transition-all" 
                    : "relative py-1 text-slate-600 dark:text-slate-400 hover:text-primary font-medium text-sm tracking-wide transition-all hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-primary/30 hover:after:rounded-full"}
                >
                  {item.label}
                </NavLink>
              ))}
              {user?.role === 'ADMIN' && (
                <NavLink
                  to="/admin"
                  className={({isActive}) => isActive 
                    ? "relative py-1 text-primary font-bold text-sm tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full transition-all" 
                    : "relative py-1 text-slate-600 dark:text-slate-400 hover:text-primary font-medium text-sm tracking-wide transition-all hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-primary/30 hover:after:rounded-full"}
                >
                  Quản trị
                </NavLink>
              )}
            </div>
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block" ref={searchRef}>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">
                  search
                </span>
                <input 
                  className="bg-slate-100 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 w-72 transition-all duration-300 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 shadow-inner" 
                  placeholder="Tìm kiếm sản phẩm đỉnh cao..." 
                  type="text" 
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setSearchOpen(true)}
                />
              </div>
              
              {searchOpen && (searchText.trim() || searchLoading) && (
                <div className="absolute top-full mt-4 w-[450px] -right-10 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                  {searchLoading ? (
                    <div className="p-12 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="p-4">
                      <div className="flex items-center justify-between px-2 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kết quả hàng đầu</span>
                        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold">{suggestions.length} gợi ý</span>
                      </div>
                      <div className="space-y-1.5">
                        {suggestions.map((p) => (
                          <button
                            key={p._id}
                            onClick={() => {
                              navigate(`/products/${p._id}`);
                              setSearchOpen(false);
                            }}
                            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
                          >
                            <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group-hover:border-primary/20 transition-colors">
                              {p.image ? (
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <span className="material-symbols-outlined text-slate-300">image</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-primary">{p.price?.toLocaleString()} ₫</span>
                                <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md capitalize">{p.brandName}</span>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">chevron_right</span>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => goSearch(searchText)}
                        className="w-full mt-4 py-4 border-t border-slate-50 dark:border-slate-800 text-[11px] font-bold text-primary hover:bg-primary/5 rounded-b-2xl transition-all flex items-center justify-center gap-2"
                      >
                        XEM TẤT CẢ KẾT QUẢ CHO "{searchText}"
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">Không có kết quả</p>
                      <p className="text-xs text-slate-500 mt-1">Vui lòng thử từ khóa khác</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1.5 ml-2">
              <Link to="/wishlist" className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 rounded-xl transition-all active:scale-90" title="Yêu thích">
                <span className="material-symbols-outlined text-2xl">favorite</span>
              </Link>
              <Link to="/cart" className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-all active:scale-90 relative" title="Giỏ hàng">
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              </Link>
              {user && (
                <Link to="/orders" className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-all active:scale-90" title="Đơn hàng">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </Link>
              )}
            </div>

            {/* User Section */}
            <div className="flex items-center ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-xl">person</span>
                        </div>
                      )}
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">Thành viên</p>
                    </div>
                  </Link>
                  <button 
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                >
                  Đăng nhập
                  <span className="material-symbols-outlined text-sm">login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
