import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', logo: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await api.get('/brands');
            setBrands(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (brand) => {
        setFormData({ name: brand.name, logo: brand.logo || '' });
        setIsEditing(true);
        setCurrentId(brand._id);
        setError('');
    };

    const resetForm = () => {
        setFormData({ name: '', logo: '' });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không? Sản phẩm thuộc thương hiệu này sẽ bị ảnh hưởng.')) return;
        try {
            await api.delete(`/brands/${id}`);
            setSuccess('Đã xóa thương hiệu thành công!');
            fetchBrands();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Lỗi khi xóa thương hiệu.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/brands/${currentId}`, formData);
                setSuccess('Cập nhật thương hiệu thành công!');
            } else {
                await api.post('/brands', formData);
                setSuccess('Thêm thương hiệu mới thành công!');
            }
            fetchBrands();
            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu thương hiệu.');
        }
    };

    if (loading) return (
        <AdminLayout title="Quản lý Thương hiệu">
            <div className="h-64 flex items-center justify-center text-slate-400 font-bold text-xs tracking-widest uppercase">
                <span className="material-symbols-outlined animate-spin text-primary mr-2">branding_watermark</span>
                Đang nạp dữ liệu đối tác...
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout
            title="Quản lý Thương hiệu"
            subtitle="Hợp tác và mở rộng danh mục cung ứng Lumina Mobile."
        >
            <div className="grid grid-cols-12 gap-8 text-left">
                {/* Brand Table Container */}
                <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-fade-in shadow-sm">
                            <span className="material-symbols-outlined">verified</span>
                            <span className="text-sm font-bold">{success}</span>
                        </div>
                    )}
                    
                    <div className="bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thương hiệu</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo (URL)</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {brands.map((brand) => (
                                    <tr key={brand._id} className="hover:bg-slate-50/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 p-2 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center font-black text-primary">
                                                    {brand.logo ? <img src={brand.logo} className="object-contain w-full h-full" alt={brand.name} /> : brand.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-extrabold text-on-surface">{brand.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">ID: {brand._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs text-secondary font-medium truncate max-w-[200px]" title={brand.logo || 'Chưa cập nhật'}>
                                                {brand.logo || '—'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 text-slate-400 group-hover:text-on-surface">
                                                <button 
                                                    onClick={() => handleEdit(brand)}
                                                    className="p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm bg-slate-50 group-hover:bg-white"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(brand._id)}
                                                    className="p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm bg-slate-50 group-hover:bg-white"
                                                    title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-base">cancel</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Add Form Section */}
                <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                    <div className="bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/10 p-8 sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                <span className="material-symbols-outlined">add_business</span>
                            </div>
                            <h3 className="text-lg font-black tracking-tight">{isEditing ? 'Cập nhật đối tác' : 'Hợp tác mới'}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Tên thương hiệu</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Vd: Apple, Samsung..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Link Logo (URL)</label>
                                <input 
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Dán link ảnh logo..."
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    type="submit"
                                    className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-xs tracking-widest uppercase"
                                >
                                    {isEditing ? 'Lưu thay đổi' : 'Thêm thương hiệu'}
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

export default AdminBrands;
