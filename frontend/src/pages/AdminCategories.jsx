import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);

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
                            </div>
                        </form>
                    </div>
                </div>
            </div>

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
