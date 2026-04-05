import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import AdminFooter from '../components/AdminFooter';

const menuItems = [
    { to: '/admin', label: 'Tổng quan', icon: 'dashboard', end: true },
    { to: '/admin/products', label: 'Sản phẩm', icon: 'inventory_2' },
    { to: '/admin/categories', label: 'Danh mục', icon: 'category' },
    { to: '/admin/brands', label: 'Thương hiệu', icon: 'branding_watermark' },
    { to: '/admin/reviews', label: 'Đánh giá', icon: 'rate_review' },
    { to: '/admin/orders', label: 'Đơn hàng', icon: 'local_shipping' },
    { to: '/admin/customers', label: 'Khách hàng', icon: 'group' },
];

const AdminLayout = ({ title, subtitle, actions, children }) => {
    return (
        <div className="bg-surface text-on-background min-h-screen text-left">
            {/* TopNavBar */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-outline-variant/10">
                <div className="flex items-center justify-between px-6 py-4 max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-8">
                        <Link to="/admin" className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-50">Lumina Quản trị</Link>
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            <span className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 pb-1">Tổng quan</span>
                            <Link to="/products" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all duration-300">Cửa hàng</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                            <input className="bg-surface-container-high border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64" placeholder="Tìm kiếm dữ liệu..." type="text" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-600 hover:opacity-80 active:scale-95 duration-200">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="p-2 text-slate-600 hover:opacity-80 active:scale-95 duration-200">
                                <span className="material-symbols-outlined">account_circle</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex pt-[72px] min-h-screen">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-surface-container-low hidden lg:block fixed h-full border-r border-outline-variant/10 z-40">
                    <nav className="p-4 flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-outline tracking-widest uppercase px-4 mb-4 mt-2">Menu chính</p>
                        
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isActive 
                                            ? 'bg-primary text-on-primary font-semibold' 
                                            : 'text-on-surface-variant hover:bg-surface-container-high'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </NavLink>
                        ))}

                        <p className="text-[10px] font-bold text-outline tracking-widest uppercase px-4 mb-4 mt-8">Hệ thống</p>
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all duration-200">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm">Về trang người dùng</span>
                        </Link>
                    </nav>
                </aside>

                {/* Main Content Canvas */}
                <main className="flex-1 lg:ml-64 bg-surface flex flex-col">
                    <div className="p-8 flex-grow">
                        {/* Header Section */}
                        {(title || subtitle || actions) && (
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 text-left">
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h1>
                                    {subtitle && <p className="text-on-surface-variant mt-1">{subtitle}</p>}
                                </div>
                                {actions && <div className="flex gap-3">{actions}</div>}
                            </div>
                        )}
                        
                        {children}
                    </div>
                    
                    <AdminFooter />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
