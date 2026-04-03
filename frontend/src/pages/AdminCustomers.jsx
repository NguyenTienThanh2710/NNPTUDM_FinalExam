import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const getStatusStyle = (status) => {
    switch(status) {
        case 'Hoạt động':
            return {
                bg: 'bg-green-50',
                text: 'text-green-700',
                dot: 'bg-green-500'
            };
        case 'Đã khóa':
            return {
                bg: 'bg-error-container',
                text: 'text-on-error-container',
                dot: 'bg-error'
            };
        default:
            return {
                bg: 'bg-slate-100',
                text: 'text-slate-600',
                dot: 'bg-slate-400'
            };
    }
};

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        api.get('/auth/users').then(res => setCustomers(res.data)).catch(console.error);
    }, []);

    const mapStatus = (s) => s === 'active' ? 'Hoạt động' : 'Đã khóa';

    return (
        <AdminLayout
            title="Danh sách Người dùng"
            subtitle={<>Tổng cộng <span className="font-bold text-on-surface">{customers.length}</span> người dùng hiện diện trong hệ thống.</>}
            actions={(
                <>
                    <button className="flex items-center gap-2 bg-surface-container-high px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">file_download</span>
                        Xuất báo cáo
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Thêm khách hàng
                    </button>
                </>
            )}
        >
            {/* Bento Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-blue-700">trending_up</span>
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-secondary text-sm font-medium">Tỷ lệ mua lại</p>
                    <p className="text-3xl font-bold mt-1">68.2%</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-tertiary-fixed p-3 rounded-xl">
                            <span className="material-symbols-outlined text-tertiary">loyalty</span>
                        </div>
                    </div>
                    <p className="text-secondary text-sm font-medium">Khách hàng VIP</p>
                    <p className="text-3xl font-bold mt-1">156</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-slate-100 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-slate-600">mail</span>
                        </div>
                    </div>
                    <p className="text-secondary text-sm font-medium">Email đã gửi (tháng này)</p>
                    <p className="text-3xl font-bold mt-1">3,490</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10 text-left">
                <div className="p-6 border-b border-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        <button className="bg-surface-container-high px-4 py-2 rounded-full text-sm font-medium text-primary whitespace-nowrap">Tất cả</button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-secondary hover:bg-slate-50 whitespace-nowrap">Hoạt động</button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-secondary hover:bg-slate-50 whitespace-nowrap">Bị khóa</button>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm text-secondary">Sắp xếp theo:</span>
                        <select className="text-sm font-semibold bg-transparent border-none focus:ring-0 cursor-pointer pl-0">
                            <option>Mới nhất</option>
                            <option>Tổng đơn hàng cao nhất</option>
                            <option>Tên (A-Z)</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Khách hàng</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Liên hệ</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Tổng đơn hàng</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary">Trạng thái</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-secondary text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {customers.map((customer) => {
                                const statusVi = mapStatus(customer.status);
                                const style = getStatusStyle(statusVi);
                                return (
                                    <tr key={customer._id} className="group hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center shadow-sm overflow-hidden text-xs">
                                                    {customer.avatar ? <img src={customer.avatar} className="object-cover w-full h-full" /> : customer.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface">{customer.name}</p>
                                                    <p className="text-xs text-secondary mt-0.5">ID: {customer._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-on-surface">{customer.email}</p>
                                            <p className="text-xs text-secondary mt-0.5">{customer.role_id?.name}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-on-surface">N/A</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                {statusVi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button className="p-2 text-error hover:bg-error-container rounded-lg transition-colors" title="Khóa TK">
                                                    <span className="material-symbols-outlined text-xl">block</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/20">
                    <p className="text-xs text-secondary font-medium">Hiển thị <span className="font-bold text-on-surface">tất cả</span> <span className="font-bold text-on-surface">{customers.length}</span></p>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-secondary disabled:opacity-30" disabled>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-xs font-bold">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-xs font-bold">3</button>
                        <span className="px-2 text-secondary">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-xs font-bold">129</button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-secondary">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;