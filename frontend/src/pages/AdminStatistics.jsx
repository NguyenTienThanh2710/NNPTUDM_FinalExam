import React from 'react';
import AdminLayout from './AdminLayout';

const AdminStatistics = () => {
    return (
        <AdminLayout
            title="Thống kê & Phân tích"
            subtitle="Báo cáo hệ thống và hiệu suất tổng quan."
            actions={(
                <>
                    <button className="bg-surface-container-high px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        30 ngày qua
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Xuất báo cáo
                    </button>
                </>
            )}
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <span className="material-symbols-outlined text-blue-700">payments</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Lợi nhuận ròng</p>
                    <h3 className="text-2xl font-bold text-on-surface">2.450.000.000đ</h3>
                    <p className="text-[10px] text-outline mt-3 uppercase tracking-wider">Dự báo: Tăng trưởng ổn định</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <span className="material-symbols-outlined text-purple-700">ads_click</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Tỷ lệ chuyển đổi</p>
                    <h3 className="text-2xl font-bold text-on-surface">3.85%</h3>
                    <div className="w-full bg-surface-container mt-4 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[65%]"></div>
                    </div>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <span className="material-symbols-outlined text-orange-700">shopping_bag</span>
                        </div>
                        <span className="text-xs font-bold text-error bg-error-container/20 px-2 py-1 rounded-full">-1.2%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium mb-1">Giá trị đơn hàng TB</p>
                    <h3 className="text-2xl font-bold text-on-surface">18.500.000đ</h3>
                    <p className="text-[10px] text-outline mt-3 uppercase tracking-wider">Dựa trên 1,240 giao dịch</p>
                </div>
            </div>

            {/* Bento Grid Charts */}
            <div className="grid grid-cols-12 gap-6 text-left">
                {/* Main Revenue Chart */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 h-[450px] relative overflow-hidden flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h4 className="text-lg font-bold">Doanh thu theo thời gian</h4>
                            <p className="text-xs text-secondary">Thống kê chi tiết từ 01/10 - 31/10</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-xs font-medium text-secondary">
                                <span className="w-3 h-3 rounded-full bg-primary"></span> Doanh thu
                            </span>
                            <span className="flex items-center gap-2 text-xs font-medium text-secondary">
                                <span className="w-3 h-3 rounded-full bg-primary-container opacity-30"></span> Mục tiêu
                            </span>
                        </div>
                    </div>
                    
                    {/* Mock Chart Visualization */}
                    <div className="relative w-full flex-grow flex items-end justify-between px-2 pt-4">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                            <div className="border-t border-surface-container-high w-full h-0"></div>
                        </div>
                        
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[60%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[45%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 1</span>
                        </div>
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[75%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[65%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 2</span>
                        </div>
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[85%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[95%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity shadow-lg shadow-primary/30"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 3</span>
                        </div>
                        <div className="group relative flex flex-col justify-end w-12 sm:w-16 h-full pb-8">
                            <div className="bg-primary/10 w-full h-[70%] rounded-t-lg absolute bottom-8"></div>
                            <div className="bg-primary w-full h-[55%] rounded-t-lg relative z-10 hover:opacity-80 transition-opacity"></div>
                            <span className="text-[10px] sm:text-xs text-outline text-center mt-2 absolute bottom-0 w-full">Tuần 4</span>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 h-[450px] flex flex-col items-center justify-center">
                    <div className="w-full">
                        <h4 className="text-lg font-bold mb-1">Sản phẩm bán chạy</h4>
                        <p className="text-xs text-secondary mb-8">Tỷ trọng theo danh mục</p>
                    </div>
                    
                    <div className="relative w-48 h-48 mb-8">
                        {/* Custom SVG Pie Chart */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#eeeef0" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#003ec7" strokeDasharray="45 100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#0052ff" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#b7c4ff" strokeDasharray="30 100" strokeDashoffset="-70" strokeWidth="4"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold">840</span>
                            <span className="text-[10px] text-outline font-bold">SẢN PHẨM</span>
                        </div>
                    </div>
                    
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <span className="text-xs font-medium text-on-surface">iPhone Series</span>
                            </div>
                            <span className="text-xs font-bold">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                <span className="text-xs font-medium text-on-surface">Galaxy S Series</span>
                            </div>
                            <span className="text-xs font-bold">25%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                                <span className="text-xs font-medium text-on-surface">Phụ kiện cao cấp</span>
                            </div>
                            <span className="text-xs font-bold">30%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Sales Feature */}
            <section className="mt-12 text-left">
                <h4 className="text-sm font-bold uppercase tracking-widest text-outline mb-6">Giao dịch gần đây</h4>
                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-surface-container-low border-b border-surface-container-high">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">MÃ ĐƠN</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">KHÁCH HÀNG</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">SẢN PHẨM</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">GIÁ TRỊ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary">TRẠNG THÁI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">#VOLT-8921</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">NT</div>
                                            <span className="text-sm font-medium">Nguyễn Thành Trung</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-on-surface">iPhone 15 Pro Max 256GB</td>
                                    <td className="px-6 py-4 text-sm font-bold">32.490.000đ</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Hoàn tất</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">#VOLT-8920</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed">HL</div>
                                            <span className="text-sm font-medium">Hoàng Lan Anh</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-on-surface">Samsung Galaxy S24 Ultra</td>
                                    <td className="px-6 py-4 text-sm font-bold">29.990.000đ</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Đang giao</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">#VOLT-8919</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">PV</div>
                                            <span className="text-sm font-medium">Phạm Văn Nam</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-on-surface">Sony WH-1000XM5</td>
                                    <td className="px-6 py-4 text-sm font-bold">8.490.000đ</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Chờ xử lý</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

export default AdminStatistics;