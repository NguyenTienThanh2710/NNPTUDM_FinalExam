import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [formName, setFormName] = useState('');
    const [formLogo, setFormLogo] = useState('');
    const [editingBrandId, setEditingBrandId] = useState(null);
    const [deleteConfirmBrandId, setDeleteConfirmBrandId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const formRef = useRef(null);
    const nameInputRef = useRef(null);
    const pageSize = 6;

    useEffect(() => {
        api.get('/brands').then(res => setBrands(res.data)).catch(console.error);
    }, []);

    const pageCount = Math.ceil(brands.length / pageSize);
    const safePageCount = pageCount === 0 ? 1 : pageCount;

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    useEffect(() => {
        if (pageCount === 0) {
            if (currentPage !== 1) setCurrentPage(1);
            return;
        }
        if (currentPage > pageCount) setCurrentPage(pageCount);
    }, [currentPage, pageCount]);

    const paginatedBrands = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return brands.slice(startIndex, startIndex + pageSize);
    }, [brands, currentPage]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: safePageCount }, (_, idx) => idx + 1);
    }, [safePageCount]);

    const activeBrandCount = useMemo(() => {
        return brands.filter((b) => (b.product_count ?? 0) > 0).length;
    }, [brands]);

    const inactiveBrandCount = useMemo(() => {
        return brands.length - activeBrandCount;
    }, [brands, activeBrandCount]);

    const totalProductCount = useMemo(() => {
        return brands.reduce((sum, b) => sum + (b.product_count ?? 0), 0);
    }, [brands]);

    const fetchBrands = async () => {
        const res = await api.get('/brands');
        setBrands(res.data);
    };

    const openCreate = () => {
        setEditingBrandId(null);
        setFormName('');
        setFormLogo('');
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => nameInputRef.current?.focus(), 150);
    };

    const openEdit = (brand) => {
        setEditingBrandId(brand._id);
        setFormName(brand.name || '');
        setFormLogo(brand.logo || '');
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => nameInputRef.current?.focus(), 150);
    };

    const handleSaveBrand = async (e) => {
        e?.preventDefault();
        if (isSaving) return;

        const payload = {
            name: formName.trim(),
            logo: formLogo.trim()
        };

        if (!payload.name) {
            setNotice({ type: 'error', text: 'Vui lòng nhập tên thương hiệu.' });
            nameInputRef.current?.focus();
            return;
        }

        try {
            setIsSaving(true);
            if (editingBrandId) {
                await api.put(`/brands/${editingBrandId}`, payload);
            } else {
                await api.post('/brands', payload);
            }
            await fetchBrands();
            setNotice({ type: 'success', text: editingBrandId ? 'Cập nhật thương hiệu thành công' : 'Thêm thương hiệu thành công' });
            setFormName('');
            setFormLogo('');
            setEditingBrandId(null);
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || (editingBrandId ? 'Cập nhật thương hiệu thất bại' : 'Thêm thương hiệu thất bại') });
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetForm = () => {
        setEditingBrandId(null);
        setFormName('');
        setFormLogo('');
    };

    const handleDeleteBrand = (brandId) => {
        setDeleteConfirmBrandId(brandId);
    };

    const confirmDeleteBrand = async () => {
        const brandId = deleteConfirmBrandId;
        if (!brandId) return;
        try {
            await api.delete(`/brands/${brandId}`);
            await fetchBrands();
            setNotice({ type: 'success', text: 'Đã xoá thương hiệu' });
            if (editingBrandId === brandId) {
                handleResetForm();
            }
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Xoá thương hiệu thất bại' });
        } finally {
            setDeleteConfirmBrandId(null);
        }
    };

    return (
        <AdminLayout
            title="Quản lý Thương hiệu"
            actions={
                <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Thêm thương hiệu</span>
                </button>
            }
        >
            <div className="space-y-8 text-left">
                {notice && (
                    <div className={`rounded-xl px-4 py-3 shadow-sm border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
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
                {/* Dashboard Stats Ribbon */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-primary/20">
                        <p className="text-xs font-bold text-primary tracking-widest uppercase">Tổng số</p>
                        <h3 className="text-2xl font-black mt-1">{brands.length}</h3>
                        <p className="text-xs text-slate-400 mt-1">Thương hiệu hiện tại</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-emerald-500/20">
                        <p className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Hoạt động</p>
                        <h3 className="text-2xl font-black mt-1">{activeBrandCount.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1">Đang kinh doanh</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-amber-500/20">
                        <p className="text-xs font-bold text-amber-600 tracking-widest uppercase">Tạm ngưng</p>
                        <h3 className="text-2xl font-black mt-1">{inactiveBrandCount.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1">Chưa có sản phẩm</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-primary/20">
                        <p className="text-xs font-bold text-primary tracking-widest uppercase">Sản phẩm</p>
                        <h3 className="text-2xl font-black mt-1">{totalProductCount.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1">Tổng số sản phẩm</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Brand Table Container */}
                    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
                        <div className="p-6 border-b border-surface-container flex justify-between items-center bg-white">
                            <h3 className="font-bold text-lg">Danh sách thương hiệu</h3>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">filter_list</span>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">download</span>
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-surface-container-low/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Thương hiệu</th>
                                        <th className="px-6 py-4">Số sản phẩm</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container">
                                    {paginatedBrands.map((brand) => (
                                        <tr key={brand._id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform text-2xl font-bold font-serif overflow-hidden">
                                                        {brand.logo ? <img src={brand.logo} className="object-contain w-full h-full" alt={brand.name} /> : brand.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-on-surface">{brand.name}</p>
                                                        <p className="text-xs text-slate-400">ID: {brand._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-semibold py-1 px-3 bg-blue-50 text-blue-700 rounded-full">{(brand.product_count ?? 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {brand.product_count > 0 ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        Đang kinh doanh
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                                                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                                        Chưa có sản phẩm
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => openEdit(brand)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="Chỉnh sửa">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                <button type="button" onClick={() => handleDeleteBrand(brand._id)} className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors" title="Xoá">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedBrands.length === 0 && (
                                        <tr>
                                            <td className="px-6 py-10 text-center text-sm text-on-surface-variant" colSpan={4}>
                                                Không có thương hiệu nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pageCount > 1 && (
                            <div className="p-6 bg-surface-container-low/30 flex justify-end items-center text-sm border-t border-surface-container">
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                        disabled={currentPage <= 1}
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    {pageNumbers.map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={page === currentPage
                                                ? "w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold"
                                                : "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((p) => Math.min(safePageCount, p + 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                        disabled={currentPage >= safePageCount}
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fast Edit/Add Panel */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div ref={formRef} className="bg-surface-container-lowest p-8 rounded-xl shadow-sm sticky top-24 border border-outline-variant/10">
                            <h3 className="font-extrabold text-xl mb-6">{editingBrandId ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu mới'}</h3>
                            <form onSubmit={handleSaveBrand} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tên thương hiệu</label>
                                    <input
                                        ref={nameInputRef}
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full bg-surface-container hover:bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-slate-400 transition-colors"
                                        placeholder="Vd: Apple, Sony..."
                                        type="text"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Logo (URL)</label>
                                    <input
                                        value={formLogo}
                                        onChange={(e) => setFormLogo(e.target.value)}
                                        className="w-full bg-surface-container hover:bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-slate-400 transition-colors"
                                        placeholder="https://..."
                                        type="text"
                                    />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button onClick={handleResetForm} className="flex-1 px-4 py-3 bg-surface-container-high text-on-secondary-container rounded-xl font-bold hover:bg-slate-200 transition-colors" type="button">
                                        Làm mới
                                    </button>
                                    <button disabled={isSaving} className="flex-[2] px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed" type="submit">
                                        {isSaving ? 'Đang lưu...' : (editingBrandId ? 'Cập nhật thương hiệu' : 'Lưu thương hiệu')}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Helpful Tip Card */}
                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                                <div>
                                    <h4 className="font-bold text-primary text-sm">Mẹo quản lý</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Đảm bảo nhập đầy đủ thông tin để phân loại sản phẩm dễ dàng hơn.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {deleteConfirmBrandId && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirmBrandId(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-outline-variant/20 shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-black text-on-surface">Xác nhận xoá</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">Bạn có chắc muốn xoá thương hiệu này không?</p>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmBrandId(null)}
                                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-90 active:scale-95 transition-all"
                            >
                                Huỷ
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteBrand}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBrands;
