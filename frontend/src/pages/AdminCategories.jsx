import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [deleteConfirmCategoryId, setDeleteConfirmCategoryId] = useState(null);
    const [notice, setNotice] = useState(null);
    const formRef = useRef(null);
    const nameInputRef = useRef(null);

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        setCategories(res.data);
    };

    const handleOpenCreate = () => {
        setFormName('');
        setFormDescription('');
        setEditingCategoryId(null);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => nameInputRef.current?.focus(), 150);
    };

    const handleOpenEdit = (category) => {
        setFormName(category?.name || '');
        setFormDescription(category?.description || '');
        setEditingCategoryId(category?._id || null);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => nameInputRef.current?.focus(), 150);
    };

    const handleSaveCategory = async (e) => {
        e?.preventDefault();
        if (isSaving) return;

        const payload = {
            name: formName.trim(),
            description: formDescription.trim()
        };

        if (!payload.name) {
            setNotice({ type: 'error', text: 'Vui lòng nhập tên danh mục.' });
            nameInputRef.current?.focus();
            return;
        }

        try {
            setIsSaving(true);
            if (editingCategoryId) {
                await api.put(`/categories/${editingCategoryId}`, payload);
            } else {
                await api.post('/categories', payload);
            }
            await fetchCategories();
            setNotice({ type: 'success', text: editingCategoryId ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công' });
            setFormName('');
            setFormDescription('');
            setEditingCategoryId(null);
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || (editingCategoryId ? 'Cập nhật danh mục thất bại' : 'Thêm danh mục thất bại') });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = (categoryId) => {
        setDeleteConfirmCategoryId(categoryId);
    };

    const confirmDeleteCategory = async () => {
        const categoryId = deleteConfirmCategoryId;
        if (!categoryId) return;
        try {
            await api.delete(`/categories/${categoryId}`);
            await fetchCategories();
            setNotice({ type: 'success', text: 'Đã xoá danh mục' });
            if (editingCategoryId === categoryId) {
                setEditingCategoryId(null);
                setFormName('');
                setFormDescription('');
            }
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Xoá danh mục thất bại' });
        } finally {
            setDeleteConfirmCategoryId(null);
        }
    };

    const handleReset = () => {
        setFormName('');
        setFormDescription('');
        setEditingCategoryId(null);
    };

    return (
        <AdminLayout
            title="Quản lý Danh mục"
            
            actions={
                <button onClick={handleOpenCreate} className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    <span className="material-symbols-outlined">add_circle</span>
                    Thêm danh mục mới
                </button>
            }
        >
            <div className="grid grid-cols-12 gap-8 text-left">
                {notice && (
                    <div className={`col-span-12 rounded-xl px-4 py-3 shadow-sm border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
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
                {/* Category Table Section */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-surface-container flex justify-between items-center bg-white">
                            <h3 className="font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">list_alt</span>
                                Danh sách hiện có
                            </h3>
                            <span className="text-xs font-bold text-secondary bg-surface-container px-2 py-1 rounded">{categories.length} DANH MỤC</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-surface-container-low/50">
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">STT</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Tên danh mục</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Mô tả</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest text-center">Sản phẩm</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container">
                                    {categories.map((cat, index) => (
                                        <tr key={cat._id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-5 text-sm font-medium text-secondary">{index + 1}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined">category</span>
                                                    </div>
                                                    <span className="font-bold text-on-surface">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-secondary line-clamp-1 max-w-[150px] mt-2 block border-0">{cat.description}</td>
                                            <td className="px-6 py-5 text-sm font-bold text-on-surface text-center lg:table-cell">{(cat.product_count ?? 0).toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                {cat.product_count > 0 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        Có sản phẩm
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                        Trống
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => handleOpenEdit(cat)} className="p-2 hover:bg-primary-fixed text-primary rounded-lg transition-colors" title="Chỉnh sửa">
                                                        <span className="material-symbols-outlined text-xl">edit_note</span>
                                                    </button>
                                                    <button type="button" onClick={() => handleDeleteCategory(cat._id)} className="p-2 hover:bg-error-container text-error rounded-lg transition-colors" title="Xóa">
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Add Form Section */}
                <div className="col-span-12 lg:col-span-4">
                    <div ref={formRef} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 sticky top-24">
                        <div className="px-6 py-5 border-b border-surface-container bg-white rounded-t-xl">
                            <h3 className="font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_task</span>
                                Thêm / Sửa nhanh
                            </h3>
                        </div>
                        <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Tên danh mục</label>
                                <input
                                    ref={nameInputRef}
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="VD: iPhone 15 Series"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Mô tả chi tiết</label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    placeholder="Nhập mô tả ngắn gọn về danh mục sản phẩm..."
                                    rows="4"
                                />
                            </div>
                            <div className="pt-4 flex flex-col gap-3">
                                <button disabled={isSaving} className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed" type="submit">
                                    {isSaving ? 'Đang lưu...' : (editingCategoryId ? 'Cập nhật danh mục' : 'Lưu danh mục')}
                                </button>
                                <button onClick={handleReset} className="w-full bg-surface-container-high text-on-surface-variant font-bold py-3 rounded-xl hover:bg-surface-container-highest transition-colors" type="button">
                                    Làm mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {deleteConfirmCategoryId && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirmCategoryId(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-outline-variant/20 shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-black text-on-surface">Xác nhận xoá</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">Bạn có chắc muốn xoá danh mục này không?</p>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmCategoryId(null)}
                                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-90 active:scale-95 transition-all"
                            >
                                Huỷ
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteCategory}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Ribbon */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined">category</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Tổng danh mục</p>
                        <p className="text-2xl font-black text-on-surface">{categories.length}</p>
                    </div>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20">
                        <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Đang hiển thị</p>
                        <p className="text-2xl font-black text-on-surface">04</p>
                    </div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">SP chưa phân loại</p>
                        <p className="text-2xl font-black text-on-surface">12</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
