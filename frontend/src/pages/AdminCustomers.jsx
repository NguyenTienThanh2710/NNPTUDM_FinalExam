import React, { useEffect, useMemo, useState } from 'react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [notice, setNotice] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '', status: 'active', role: 'USER', is_vip: false });
    const [confirmCustomer, setConfirmCustomer] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        api.get('/auth/users').then(res => setCustomers(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const mapStatus = (s) => s === 'active' ? 'Hoạt động' : 'Đã khóa';

    const fetchCustomers = async () => {
        const res = await api.get('/auth/users');
        setCustomers(res.data);
    };

    const openEdit = (customer) => {
        setEditingCustomer(customer);
        setEditForm({
            name: customer?.name || '',
            email: customer?.email || '',
            phone: customer?.phone || '',
            address: customer?.address || '',
            status: customer?.status || 'active',
            role: customer?.role_id?.name || 'USER',
            is_vip: Boolean(customer?.is_vip)
        });
    };

    const closeEdit = () => {
        setEditingCustomer(null);
        setEditForm({ name: '', email: '', phone: '', address: '', status: 'active', role: 'USER', is_vip: false });
    };

    const handleSaveEdit = async (e) => {
        e?.preventDefault();
        if (!editingCustomer || isSaving) return;

        const payload = {
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            phone: editForm.phone.trim(),
            address: editForm.address.trim(),
            status: editForm.status,
            role: editForm.role,
            is_vip: editForm.is_vip
        };

        if (!payload.name || !payload.email) {
            setNotice({ type: 'error', text: 'Vui lòng nhập tên và email.' });
            return;
        }

        try {
            setIsSaving(true);
            await api.put(`/auth/users/${editingCustomer._id}`, payload);
            await fetchCustomers();
            setNotice({ type: 'success', text: 'Cập nhật khách hàng thành công' });
            closeEdit();
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || err.response?.data?.msg || err.message || 'Cập nhật khách hàng thất bại' });
        } finally {
            setIsSaving(false);
        }
    };

    const requestToggleStatus = (customer) => {
        setConfirmCustomer(customer);
    };

    const confirmToggleStatus = async () => {
        const customer = confirmCustomer;
        if (!customer || isSaving) return;

        const nextStatus = customer.status === 'active' ? 'locked' : 'active';
        try {
            setIsSaving(true);
            await api.put(`/auth/users/${customer._id}`, { status: nextStatus });
            setCustomers((prev) => prev.map((u) => u._id === customer._id ? { ...u, status: nextStatus } : u));
            setNotice({ type: 'success', text: nextStatus === 'locked' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản' });
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || err.response?.data?.msg || err.message || 'Cập nhật trạng thái thất bại' });
        } finally {
            setIsSaving(false);
            setConfirmCustomer(null);
        }
    };

    const customerUsers = useMemo(() => {
        return customers.filter((u) => u.role_id?.name === 'USER');
    }, [customers]);

    const totalCustomerCount = customerUsers.length;
    const activeCustomerCount = useMemo(() => customerUsers.filter((u) => u.status === 'active').length, [customerUsers]);
    const vipCustomerCount = useMemo(() => customerUsers.filter((u) => u.is_vip === true).length, [customerUsers]);

    const filteredCustomers = useMemo(() => {
        let list = [...customers];
        if (roleFilter !== 'all') {
            list = list.filter((u) => u.role_id?.name === roleFilter);
        }
        if (statusFilter === 'active') return list.filter((u) => u.status === 'active');
        if (statusFilter === 'locked') return list.filter((u) => u.status === 'locked');
        return list;
    }, [customers, roleFilter, statusFilter]);

    const sortedCustomers = useMemo(() => {
        const list = [...filteredCustomers];
        if (sortOption === 'orders_desc') return list.sort((a, b) => (b.order_count ?? 0) - (a.order_count ?? 0));
        if (sortOption === 'name_asc') return list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'vi'));
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [filteredCustomers, sortOption]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, roleFilter, sortOption]);

    const pageCount = Math.ceil(sortedCustomers.length / pageSize);
    const safePageCount = pageCount === 0 ? 1 : pageCount;

    useEffect(() => {
        if (pageCount === 0) {
            if (currentPage !== 1) setCurrentPage(1);
            return;
        }
        if (currentPage > pageCount) setCurrentPage(pageCount);
    }, [currentPage, pageCount]);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedCustomers.slice(startIndex, startIndex + pageSize);
    }, [currentPage, sortedCustomers]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: safePageCount }, (_, idx) => idx + 1);
    }, [safePageCount]);

    return (
        <AdminLayout
            title="Danh sách Người dùng"
            
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
            {notice && (
                <div className={`mb-6 rounded-xl px-4 py-3 shadow-sm border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
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
            )}
            {/* Bento Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-blue-700">trending_up</span>
                        </div>
                    </div>
                    <p className="text-secondary text-sm font-medium">Tổng khách hàng</p>
                    <p className="text-3xl font-bold mt-1">{totalCustomerCount.toLocaleString()}</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-tertiary-fixed p-3 rounded-xl">
                            <span className="material-symbols-outlined text-tertiary">loyalty</span>
                        </div>
                    </div>
                    <p className="text-secondary text-sm font-medium">Khách hàng VIP</p>
                    <p className="text-3xl font-bold mt-1">{vipCustomerCount.toLocaleString()}</p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-slate-100 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-slate-600">mail</span>
                        </div>
                    </div>
                    <p className="text-secondary text-sm font-medium">Đang hoạt động</p>
                    <p className="text-3xl font-bold mt-1">{activeCustomerCount.toLocaleString()}</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10 text-left">
                <div className="p-6 border-b border-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            className={statusFilter === 'all'
                                ? "bg-surface-container-high px-4 py-2 rounded-full text-sm font-medium text-primary whitespace-nowrap"
                                : "px-4 py-2 rounded-full text-sm font-medium text-secondary hover:bg-slate-50 whitespace-nowrap"}
                        >
                            Tất cả
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('active')}
                            className={statusFilter === 'active'
                                ? "bg-surface-container-high px-4 py-2 rounded-full text-sm font-medium text-primary whitespace-nowrap"
                                : "px-4 py-2 rounded-full text-sm font-medium text-secondary hover:bg-slate-50 whitespace-nowrap"}
                        >
                            Hoạt động
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('locked')}
                            className={statusFilter === 'locked'
                                ? "bg-surface-container-high px-4 py-2 rounded-full text-sm font-medium text-primary whitespace-nowrap"
                                : "px-4 py-2 rounded-full text-sm font-medium text-secondary hover:bg-slate-50 whitespace-nowrap"}
                        >
                            Bị khóa
                        </button>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm text-secondary">Vai trò:</span>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="text-sm font-semibold bg-transparent border-none focus:ring-0 cursor-pointer pl-0"
                        >
                            <option value="all">Tất cả</option>
                            <option value="USER">Khách hàng</option>
                            <option value="ADMIN">Quản trị</option>
                        </select>
                        <span className="text-sm text-secondary">Sắp xếp theo:</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="text-sm font-semibold bg-transparent border-none focus:ring-0 cursor-pointer pl-0"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="orders_desc">Tổng đơn hàng cao nhất</option>
                            <option value="name_asc">Tên (A-Z)</option>
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
                            {paginatedCustomers.map((customer) => {
                                const statusVi = mapStatus(customer.status);
                                const style = getStatusStyle(statusVi);
                                const isLocked = customer.status === 'locked';
                                const isVip = customer.is_vip === true;
                                const isAdmin = customer.role_id?.name === 'ADMIN';
                                return (
                                    <tr key={customer._id} className="group hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center shadow-sm overflow-hidden text-xs">
                                                    {customer.avatar ? <img src={customer.avatar} className="object-cover w-full h-full" /> : customer.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-on-surface">{customer.name}</p>
                                                        {isVip && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                                                                <span className="material-symbols-outlined text-[14px] leading-none">workspace_premium</span>
                                                                VIP
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-secondary mt-0.5">ID: {customer._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-on-surface">{customer.email}</p>
                                            <p className="text-xs text-secondary mt-0.5">{customer.role_id?.name}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-on-surface">{(customer.order_count ?? 0).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                {statusVi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button type="button" onClick={() => openEdit(customer)} className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isAdmin}
                                                    onClick={() => requestToggleStatus(customer)}
                                                    className={isAdmin
                                                        ? "p-2 text-slate-400 rounded-lg cursor-not-allowed opacity-60"
                                                        : isLocked
                                                            ? "p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            : "p-2 text-error hover:bg-error-container rounded-lg transition-colors"}
                                                    title={isAdmin ? "Không thể khóa tài khoản quản trị" : (isLocked ? "Mở khóa" : "Khóa TK")}
                                                >
                                                    <span className="material-symbols-outlined text-xl">{isLocked ? 'lock_open' : 'block'}</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {paginatedCustomers.length === 0 && (
                                <tr>
                                    <td className="px-6 py-10 text-center text-sm text-on-surface-variant" colSpan={5}>
                                        Không có khách hàng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="px-6 py-4 flex items-center justify-end bg-surface-container-low/20">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="p-2 rounded-lg hover:bg-slate-100 text-secondary disabled:opacity-30"
                                disabled={currentPage <= 1}
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            {pageNumbers.map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={page === currentPage
                                        ? "w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold"
                                        : "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-xs font-bold"}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(safePageCount, p + 1))}
                                className="p-2 rounded-lg hover:bg-slate-100 text-secondary disabled:opacity-30"
                                disabled={currentPage >= safePageCount}
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {editingCustomer && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-outline-variant/20 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/10">
                            <div>
                                <h3 className="text-xl font-black">Chỉnh sửa khách hàng</h3>
                                <p className="text-sm text-on-surface-variant mt-1">Cập nhật thông tin và trạng thái tài khoản.</p>
                            </div>
                            <button type="button" onClick={closeEdit} className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Tên</label>
                                <input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email</label>
                                <input
                                    value={editForm.email}
                                    onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                    type="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">SĐT</label>
                                <input
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Trạng thái</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                                    disabled={editForm.role === 'ADMIN'}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="locked">Đã khóa</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Quyền</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => {
                                        const nextRole = e.target.value;
                                        setEditForm((p) => ({ ...p, role: nextRole, status: nextRole === 'ADMIN' ? 'active' : p.status }));
                                    }}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                >
                                    <option value="USER">Khách hàng</option>
                                    <option value="ADMIN">Quản trị viên</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Địa chỉ</label>
                                <textarea
                                    value={editForm.address}
                                    onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                                    rows="3"
                                />
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Khách hàng VIP</p>
                                    <p className="text-xs text-on-surface-variant">Bật để đánh dấu khách hàng VIP (thủ công).</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditForm((p) => ({ ...p, is_vip: !p.is_vip }))}
                                    className={editForm.is_vip
                                        ? "w-12 h-7 rounded-full bg-amber-500 relative transition-colors"
                                        : "w-12 h-7 rounded-full bg-slate-300 relative transition-colors"}
                                >
                                    <span className={editForm.is_vip
                                        ? "absolute top-0.5 left-[26px] w-6 h-6 rounded-full bg-white transition-all"
                                        : "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-all"}
                                    />
                                </button>
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeEdit} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">
                                    Hủy
                                </button>
                                <button disabled={isSaving} className="px-8 py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:translate-y-[-1px] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                                    {isSaving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {confirmCustomer && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmCustomer(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white border border-outline-variant/20 shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-black text-on-surface">{confirmCustomer.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">
                                {confirmCustomer.status === 'active'
                                    ? 'Bạn có chắc muốn khóa tài khoản này không?'
                                    : 'Bạn có chắc muốn mở khóa tài khoản này không?'}
                            </p>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmCustomer(null)}
                                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-90 active:scale-95 transition-all"
                            >
                                Huỷ
                            </button>
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={confirmToggleStatus}
                                className={confirmCustomer.status === 'active'
                                    ? "px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    : "px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"}
                            >
                                {isSaving ? 'Đang xử lý...' : (confirmCustomer.status === 'active' ? 'Khóa' : 'Mở khóa')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCustomers;
