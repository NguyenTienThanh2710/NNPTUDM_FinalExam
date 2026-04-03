import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
