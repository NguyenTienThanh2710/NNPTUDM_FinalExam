import React from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    return (
        <AdminLayout
            title="Bảng điều khiển"
            subtitle="Số liệu hiệu suất thời gian thực cho các cửa hàng chủ chốt của Lumina Mobile."
            actions={(
                <>
                    <button className="bg-surface-container-high text-on-surface font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-80 transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Xuất báo cáo
                    </button>
                    <button className="bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-300">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Thêm sản phẩm mới
                    </button>
                </>
            )}
        >
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">payments</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Doanh thu hôm nay</p>
                    <h3 className="text-2xl font-bold mt-1">84,500,000 VNĐ</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">shopping_bag</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-bold mt-1">1,284</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-error-container/50 rounded-lg">
                            <span className="material-symbols-outlined text-error">warning</span>
                        </div>
                        <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full">Critical</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Sắp hết hàng</p>
                    <h3 className="text-2xl font-bold mt-1">12</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-high rounded-lg">
                            <span className="material-symbols-outlined text-secondary">group</span>
                        </div>
                        <span className="text-xs font-bold text-outline bg-surface-container-high px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm font-medium text-outline">Khách hàng HĐ</p>
                    <h3 className="text-2xl font-bold mt-1">8,942</h3>
                </div>
            </div>

            {/* Main Dashboard Charts/Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 text-left">
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold">Luồng doanh thu hàng tháng</h2>
                        <select className="bg-surface-container-low border-none rounded-lg text-xs font-bold py-1.5 px-3 focus:ring-0">
                            <option>6 tháng qua</option>
                            <option>Từ đầu năm</option>
                        </select>
                    </div>
                    
                    {/* Placeholder for Chart using CSS Grids/Flex to simulate */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        <div className="w-full bg-surface-container-high rounded-t-lg h-[42%] group relative">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Jun: 420M</div>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-t-lg h-[58%] group relative"></div>
                        <div className="w-full bg-surface-container-high rounded-t-lg h-[46%] group relative"></div>
                        <div className="w-full bg-primary-fixed rounded-t-lg h-[76%] group relative"></div>
                        <div className="w-full bg-primary-fixed rounded-t-lg h-[66%] group relative"></div>
                        <div className="w-full bg-primary rounded-t-lg h-[92%] group relative">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Now: 920M</div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                        <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Phân bổ thiết bị</h2>
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">smartphone</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Lumina Pro 15</span>
                                    <span>62%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full">
                                    <div className="h-full bg-primary rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500">tablet_mac</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Lumina Tab X</span>
                                    <span>24%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full">
                                    <div className="h-full bg-secondary rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-500">watch</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Lumina Watch</span>
                                    <span>14%</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container-high rounded-full">
                                    <div className="h-full bg-[#bf3003] rounded-full" style={{ width: '14%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-6 py-3 rounded-xl border border-outline-variant/20 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                        Xem tất cả số liệu
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;