import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

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
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
