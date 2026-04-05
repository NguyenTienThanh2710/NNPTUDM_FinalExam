import React from 'react';

const AdminFooter = () => {
    return (
        <footer className="w-full bg-surface-container-low border-t border-outline-variant/10 py-6 px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[14px]">bolt</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface uppercase tracking-tighter">Lumina Admin Panel</span>
                </div>
                
                <p className="text-[11px] font-bold text-outline uppercase tracking-widest">
                    © 2026 Hệ thống quản trị nội bộ. Bảo mật tối đa.
                </p>
                
                <div className="flex items-center gap-6">
                    <a href="#" className="text-[10px] font-bold text-outline hover:text-primary transition-colors uppercase tracking-widest">Tài liệu</a>
                    <a href="#" className="text-[10px] font-bold text-outline hover:text-primary transition-colors uppercase tracking-widest">Hỗ trợ kỹ thuật</a>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Hệ thống ổn định</span>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;
