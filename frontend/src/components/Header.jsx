import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Shop' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  const [user, setUser] = useState(null);
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

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
      window.location.reload(); // Refresh to clear all states
    }
  };

  return (
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64" placeholder="Search devices..." type="text" />
          </div>
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
                onClick={handleLogout}
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
  );
}
