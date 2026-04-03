import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getAuthUser } from '../utils/auth';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Shop' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user on mount
    const authUser = getAuthUser();
    setUser(authUser);

    // Listen for storage changes (login/logout from other tabs or this tab)
    const handleStorageChange = () => {
      const authUser = getAuthUser();
      setUser(authUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Setup interval to check token changes (for same tab updates)
  useEffect(() => {
    const checkAuth = setInterval(() => {
      const authUser = getAuthUser();
      setUser(prevUser => {
        // Only update if actually changed
        if ((!prevUser && authUser) || (prevUser && !authUser) || (prevUser?.id !== authUser?.id)) {
          return authUser;
        }
        return prevUser;
      });
    }, 500);

    return () => clearInterval(checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
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
          
          {user ? (
            <>
              <Link to="/profile" className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:opacity-80 active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-600 dark:text-slate-400 transition-all duration-300 hover:opacity-80 active:scale-95"
                title="Logout"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </>
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
