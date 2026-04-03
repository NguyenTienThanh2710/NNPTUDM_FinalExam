import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
<<<<<<< HEAD
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (cat) => {
        setFormData({ name: cat.name, description: cat.description || '' });
        setIsEditing(true);
        setCurrentId(cat._id);
        setError('');
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa danh mục này có thể ảnh hưởng đến các sản phẩm liên quan. Bạn có chắc không?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setSuccess('Đã xóa danh mục thành công!');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Lỗi khi xóa danh mục.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/categories/${currentId}`, formData);
                setSuccess('Cập nhật danh mục thành công!');
            } else {
                await api.post('/categories', formData);
                setSuccess('Thêm danh mục mới thành công!');
            }
            fetchCategories();
            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu danh mục.');
        }
    };

    if (loading) return (
        <AdminLayout title="Quản lý Danh mục">
            <div className="h-64 flex items-center justify-center text-slate-400 font-bold text-xs tracking-widest uppercase">
                <span className="material-symbols-outlined animate-spin text-primary mr-2">category</span>
                Đang nạp bộ lọc danh mục...
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout
            title="Quản lý Danh mục"
            subtitle="Phân loại hệ sinh thái thiết bị di động Lumina."
        >
            <div className="grid grid-cols-12 gap-8 text-left">
                {/* Left: Category Table */}
                <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-fade-in shadow-sm">
                            <span className="material-symbols-outlined">check_circle</span>
                            <span className="text-sm font-bold">{success}</span>
                        </div>
                    )}
                    
                    <div className="bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên danh mục</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.map((cat) => (
                                    <tr key={cat._id} className={`hover:bg-slate-50/40 transition-colors group ${currentId === cat._id ? 'bg-primary/5' : ''}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined">category</span>
                                                </div>
                                                <span className="font-extrabold text-on-surface">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs text-secondary font-medium line-clamp-1 max-w-[200px]" title={cat.description}>
                                                {cat.description || 'Chưa có mô tả'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 text-slate-400">
                                                <button 
                                                    onClick={() => handleEdit(cat)}
                                                    className="p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm bg-slate-50 group-hover:bg-white"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit_note</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm bg-slate-50 group-hover:bg-white"
                                                    title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Add/Edit Form */}
                <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                    <div className="bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/10 p-8 sticky top-24">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                <span className="material-symbols-outlined">post_add</span>
                            </div>
                            <h3 className="text-lg font-black tracking-tight">{isEditing ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Tên hiển thị</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300"
                                    placeholder="Vd: iPhone, MacBook..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Mô tả ngắn</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none placeholder:text-slate-300"
                                    placeholder="Tóm tắt về nhóm sản phẩm này..."
                                    rows="4"
                                ></textarea>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                    {error}
                                </div>
                            )}

                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    type="submit"
                                    className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-xs tracking-widest uppercase"
                                >
                                    {isEditing ? 'Lưu thay đổi' : 'Thêm danh mục'}
                                </button>
                                {isEditing && (
                                    <button 
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all text-xs tracking-widest uppercase"
                                    >
                                        Hủy & Tạo mới
                                    </button>
                                )}
=======

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    }, []);
    return (
        <AdminLayout
            title="Quản lý Danh mục"
            subtitle="Tổ chức và phân loại các dòng sản phẩm trong showroom của bạn."
            actions={
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    <span className="material-symbols-outlined">add_circle</span>
                    Thêm danh mục mới
                </button>
            }
        >
            <div className="grid grid-cols-12 gap-8 text-left">
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
                                            <td className="px-6 py-5 text-sm font-bold text-on-surface text-center lg:table-cell">N/A</td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    Hiển thị
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 hover:bg-primary-fixed text-primary rounded-lg transition-colors" title="Chỉnh sửa">
                                                        <span className="material-symbols-outlined text-xl">edit_note</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-error-container text-error rounded-lg transition-colors" title="Xóa">
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
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 sticky top-24">
                        <div className="px-6 py-5 border-b border-surface-container bg-white rounded-t-xl">
                            <h3 className="font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_task</span>
                                Thêm / Sửa nhanh
                            </h3>
                        </div>
                        <form className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Tên danh mục</label>
                                <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="VD: iPhone 15 Series" type="text" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Mô tả chi tiết</label>
                                <textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Nhập mô tả ngắn gọn về danh mục sản phẩm..." rows="4"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Trạng thái hiển thị</label>
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input defaultChecked className="hidden peer" name="status" type="radio" />
                                        <div className="text-center py-2 rounded-xl border-2 border-transparent bg-surface-container-low peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-primary transition-all font-semibold text-sm">
                                            Hiển thị
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input className="hidden peer" name="status" type="radio" />
                                        <div className="text-center py-2 rounded-xl border-2 border-transparent bg-surface-container-low peer-checked:border-secondary peer-checked:bg-secondary-container peer-checked:text-on-secondary-container transition-all font-semibold text-sm">
                                            Ẩn tạm
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 flex flex-col gap-3">
                                <button className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all" type="button">
                                    Lưu danh mục
                                </button>
                                <button className="w-full bg-surface-container-high text-on-surface-variant font-bold py-3 rounded-xl hover:bg-surface-container-highest transition-colors" type="reset">
                                    Làm mới
                                </button>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                            </div>
                        </form>
                    </div>
                </div>
            </div>
<<<<<<< HEAD
=======

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
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
        </AdminLayout>
    );
};

export default AdminCategories;
