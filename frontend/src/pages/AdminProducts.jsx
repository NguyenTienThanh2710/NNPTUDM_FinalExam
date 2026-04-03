import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
<<<<<<< HEAD
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        images: [''],
        category_id: '',
        brand_id: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, brandRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories'),
                api.get('/brands')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setBrands(brandRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: [e.target.value] }); // Simplified for now
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            stock: '',
            images: [''],
            category_id: '',
            brand_id: '',
        });
        setIsEditing(false);
        setCurrentId(null);
        setError('');
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description || '',
            stock: product.stock,
            images: product.images || [''],
            category_id: product.category_id?._id || product.category_id || '',
            brand_id: product.brand_id?._id || product.brand_id || '',
        });
        setIsEditing(true);
        setCurrentId(product._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
        try {
            await api.delete(`/products/${id}`);
            setSuccess('Đã xóa sản phẩm thành công!');
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Lỗi khi xóa sản phẩm');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/products/${currentId}`, formData);
                setSuccess('Cập nhật sản phẩm thành công!');
            } else {
                await api.post('/products', formData);
                setSuccess('Thêm sản phẩm mới thành công!');
            }
            fetchData();
            setShowForm(false);
            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    if (loading) return (
        <AdminLayout title="Quản lý Sản phẩm">
            <div className="flex items-center justify-center h-64 gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                Đang nạp dữ liệu kho hàng...
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout
            title="Quản lý Sản phẩm"
            subtitle="Danh sách đầy đủ thiết bị và phụ kiện hiện có trong hệ thống."
            actions={
                <button 
                    onClick={() => { setShowForm(!showForm); if(isEditing) resetForm(); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
                        showForm ? 'bg-surface-container-high text-on-surface' : 'bg-primary text-white shadow-primary/20'
                    }`}
                >
                    <span className="material-symbols-outlined">{showForm ? 'list' : 'add'}</span>
                    {showForm ? 'Quay lại danh sách' : 'Thêm sản phẩm'}
                </button>
            }
        >
            <div className="text-left">
                {/* Status Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3 animate-bounce-in">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span className="font-bold text-sm">{success}</span>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}

                {showForm ? (
                    /* Product Form UI */
                    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">inventory</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">{isEditing ? 'Chỉnh sửa sản phẩm' : 'Đăng ký sản phẩm mới'}</h3>
                                <p className="text-xs text-secondary font-medium uppercase tracking-widest mt-1">Thông tin chi tiết thiết bị</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left View: Image & Category Select */}
                            <div className="lg:col-span-1 space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Hình ảnh bìa (URL)</label>
                                    <div className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 relative group overflow-hidden">
                                        {formData.images[0] ? (
                                            <img src={formData.images[0]} alt="Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">add_photo_alternate</span>
                                                <p className="text-[10px] font-bold text-slate-400">Xem trước hình ảnh</p>
                                            </>
                                        )}
                                    </div>
                                    <input 
                                        className="w-full mt-4 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                                        placeholder="Dán link ảnh tại đây (Unsplash, imgur...)"
                                        value={formData.images[0]}
                                        onChange={handleImageChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Danh mục</label>
                                        <select 
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                                            required
                                        >
                                            <option value="">Chọn danh mục...</option>
                                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Thương hiệu</label>
                                        <select 
                                            name="brand_id"
                                            value={formData.brand_id}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                                            required
                                        >
                                            <option value="">Chọn thương hiệu...</option>
                                            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Right View: Main Details */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Tên sản phẩm</label>
                                        <input 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-lg font-black tracking-tight focus:ring-4 focus:ring-primary/10 outline-none" 
                                            placeholder="iPhone 15 Pro Max, v.v..." 
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Giá niêm yết (VNĐ)</label>
                                        <input 
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Số lượng tồn kho</label>
                                        <input 
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Mô tả sản phẩm</label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="6"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        placeholder="Đặc điểm nổi bật, cấu hình, v.v..."
                                    ></textarea>
                                </div>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setShowForm(false); resetForm(); }}
                                        className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                                    >
                                        {isEditing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Products Table UI */
                    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden animate-fade-in">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin sản phẩm</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Phân loại</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Đơn giá</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Tồn kho</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Quản lý</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.map(product => (
                                    <tr key={product._id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1 flex-shrink-0">
                                                    <img src={product.images[0]} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-extrabold text-on-surface line-clamp-1">{product.name}</h4>
                                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.1em] mt-0.5">{product.brand_id?.name || '---'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-left">
                                            <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full uppercase">
                                                {product.category_id?.name || 'Chưa định danh'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="font-black text-on-surface">{product.price.toLocaleString()} ₫</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className={`text-sm font-bold ${product.stock <= 5 ? 'text-error' : 'text-slate-700'}`}>
                                                {product.stock}
                                            </div>
                                            <div className="w-16 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                                                <div className={`h-full ${product.stock <= 5 ? 'bg-error' : 'bg-emerald-400'}`} style={{width: `${Math.min(100, (product.stock / 20) * 100)}%`}}></div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-base">delete</span>
=======

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(console.error);
    }, []);

    return (
        <AdminLayout
            title="Quản lý Sản phẩm"
            subtitle="Cập nhật và theo dõi danh mục thiết bị công nghệ của bạn."
            actions={
                <button className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-95">
                    <span className="material-symbols-outlined">add</span>
                    Thêm sản phẩm mới
                </button>
            }
        >
            <div className="text-left space-y-8">
                {/* Dashboard Stats / Quick Filters Bento */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-wrap gap-4 items-center">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mr-2">Bộ lọc nhanh:</span>
                        <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">Tất cả</button>
                        <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors">iPhone</button>
                        <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors">Samsung</button>
                        <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors">Phụ kiện</button>
                        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                        <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors">Còn hàng</button>
                        <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors">Hết hàng</button>
                    </div>
                    <div className="bg-primary text-white p-6 rounded-xl shadow-lg flex flex-col justify-center">
                        <p className="text-primary-fixed text-xs font-bold uppercase tracking-widest">Tổng sản phẩm</p>
                        <h3 className="text-4xl font-black mt-1">{products.length}</h3>
                    </div>
                </div>

                {/* Products Table Section */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-surface-container-high">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Sản phẩm</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Danh mục</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Giá bán</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Tồn kho</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-lg bg-surface-container-low p-2 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-primary-fixed bg-primary ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}>
                                                    {product.images && product.images[0] ? <img src={product.images[0]} className="object-cover w-full h-full rounded" /> : product.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</p>
                                                    <p className="text-xs text-slate-400">ID: {product._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{product.category_id?.name || '---'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-bold text-slate-900">{product.price.toLocaleString()}đ</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <p className={`text-sm ${product.stock > 0 ? 'font-medium' : 'font-bold text-error'}`}>{product.stock}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {product.stock > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Còn hàng
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-error-container text-error">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                    Hết hàng
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-all">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
<<<<<<< HEAD
                )}
=======
                    <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                        <p className="text-sm text-on-surface-variant">Hiển thị {products.length} sản phẩm</p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold">1</button>
                            <button className="w-8 h-8 rounded-lg hover:bg-white text-sm font-medium">2</button>
                            <button className="w-8 h-8 rounded-lg hover:bg-white text-sm font-medium">3</button>
                            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Product Modal Preview (Floating Form Layout) */}
                <div className="mt-16 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">post_add</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Thông tin chi tiết Sản phẩm</h3>
                            <p className="text-sm text-on-surface-variant">Chỉnh sửa hoặc thêm mới thông tin vào kho hàng của bạn.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column: Media Upload */}
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Ảnh sản phẩm</label>
                            <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary mb-4">cloud_upload</span>
                                <p className="text-sm font-bold text-slate-900 mb-1">Tải ảnh lên hoặc kéo thả</p>
                                <p className="text-xs text-slate-500">PNG, JPG up to 10MB (Khuyên dùng 1000x1000px)</p>
                            </div>
                        </div>
                        
                        {/* Right Column: Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Tên sản phẩm</label>
                                    <input className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Ví dụ: iPhone 15 Pro Max" type="text" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Thương hiệu</label>
                                    <select className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm">
                                        <option>Apple</option>
                                        <option>Samsung</option>
                                        <option>Xiaomi</option>
                                        <option>Oppo</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Giá niêm yết (VNĐ)</label>
                                    <input className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm" placeholder="0" type="number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Số lượng tồn kho</label>
                                    <input className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm" placeholder="0" type="number" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Mô tả sản phẩm</label>
                                <textarea className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Nhập đặc điểm nổi bật, thông số kỹ thuật..." rows="4"></textarea>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">Hủy bỏ</button>
                                <button className="px-8 py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:translate-y-[-1px] active:scale-95 transition-all">Lưu sản phẩm</button>
                            </div>
                        </div>
                    </div>
                </div>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
