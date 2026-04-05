import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrandFilterId, setSelectedBrandFilterId] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [deleteConfirmProductId, setDeleteConfirmProductId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [notice, setNotice] = useState(null);
    const [createForm, setCreateForm] = useState({
        name: '',
        brandId: '',
        categoryId: '',
        price: '',
        stock: '',
        imagesText: '',
        description: ''
    });
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(console.error);
        api.get('/brands').then(res => setBrands(res.data)).catch(console.error);
        api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    }, []);

    const getImageURL = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        const path = img.startsWith('/') ? img : `/${img}`;
        if (path.startsWith('/uploads/')) return `http://localhost:5000${path}`;
        return `http://localhost:5000/uploads${path}`;
    };

    useEffect(() => {
        const shouldOpen = searchParams.get('create') === '1';
        if (shouldOpen) {
            setEditingProductId(null);
            setIsCreateOpen(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const openCreate = () => {
        const next = new URLSearchParams(searchParams);
        next.set('create', '1');
        setSearchParams(next, { replace: true });
        setEditingProductId(null);
        setCreateForm({ name: '', brandId: '', categoryId: '', price: '', stock: '', imagesText: '', description: '' });
        setIsCreateOpen(true);
    };

    const closeCreate = () => {
        setIsCreateOpen(false);
        setEditingProductId(null);
        const next = new URLSearchParams(searchParams);
        next.delete('create');
        setSearchParams(next, { replace: true });
    };

    const parsedImages = useMemo(() => {
        return createForm.imagesText
            .split(/\r?\n|,/g)
            .map((s) => s.trim())
            .filter(Boolean);
    }, [createForm.imagesText]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const brandId = typeof p.brand_id === 'string' ? p.brand_id : p.brand_id?._id;
            const isBrandMatch = selectedBrandFilterId === 'all' || (brandId && brandId === selectedBrandFilterId);

            if (!isBrandMatch) return false;

            if (selectedStatusFilter === 'hidden') return p.is_visible === false;
            if (selectedStatusFilter === 'in') return p.stock > 0 && p.is_visible !== false;
            if (selectedStatusFilter === 'out') return p.stock <= 0 && p.is_visible !== false;
            return true;
        });
    }, [products, selectedBrandFilterId, selectedStatusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBrandFilterId, selectedStatusFilter]);

    const pageSize = 10;
    const pageCount = Math.ceil(filteredProducts.length / pageSize);
    const safePageCount = pageCount === 0 ? 1 : pageCount;

    useEffect(() => {
        if (pageCount === 0) {
            if (currentPage !== 1) setCurrentPage(1);
            return;
        }
        if (currentPage > pageCount) setCurrentPage(pageCount);
    }, [currentPage, pageCount]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredProducts.slice(startIndex, startIndex + pageSize);
    }, [currentPage, filteredProducts]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: safePageCount }, (_, idx) => idx + 1);
    }, [safePageCount]);

    const openEdit = (product) => {
        const brandId = typeof product.brand_id === 'string' ? product.brand_id : product.brand_id?._id;
        const categoryId = typeof product.category_id === 'string' ? product.category_id : product.category_id?._id;
        setEditingProductId(product._id);
        setCreateForm({
            name: product.name || '',
            brandId: brandId || '',
            categoryId: categoryId || '',
            price: typeof product.price === 'number' ? String(product.price) : (product.price || ''),
            stock: typeof product.stock === 'number' ? String(product.stock) : (product.stock || ''),
            imagesText: Array.isArray(product.images) ? product.images.join('\n') : '',
            description: product.description || ''
        });
        setIsCreateOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e?.preventDefault();
        if (isSaving) return;

        const payload = {
            name: createForm.name.trim(),
            price: Number(createForm.price),
            stock: Number(createForm.stock),
            description: createForm.description.trim(),
            images: parsedImages,
            category_id: createForm.categoryId,
            brand_id: createForm.brandId
        };

        if (!payload.name || !payload.category_id || !payload.brand_id || !Number.isFinite(payload.price) || !Number.isFinite(payload.stock)) {
            setNotice({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin bắt buộc (tên, danh mục, thương hiệu, giá, tồn kho).' });
            return;
        }

        try {
            setIsSaving(true);
            if (editingProductId) {
                await api.put(`/products/${editingProductId}`, payload);
            } else {
                await api.post('/products', payload);
            }
            const res = await api.get('/products');
            setProducts(res.data);
            setNotice({ type: 'success', text: editingProductId ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công' });
            setCreateForm({ name: '', brandId: '', categoryId: '', price: '', stock: '', imagesText: '', description: '' });
            closeCreate();
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || (editingProductId ? 'Cập nhật sản phẩm thất bại' : 'Thêm sản phẩm thất bại') });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUploadProductImages = async (fileList) => {
        const files = Array.from(fileList || []).filter(Boolean);
        if (!files.length || isUploadingImages) return;
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));

        try {
            setIsUploadingImages(true);
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const urls = Array.isArray(res.data?.urls) ? res.data.urls : (res.data?.url ? [res.data.url] : []);
            if (!urls.length) {
                setNotice({ type: 'error', text: 'Upload ảnh thất bại' });
                return;
            }

            setCreateForm((prev) => {
                const current = prev.imagesText ? prev.imagesText.trim() : '';
                const addition = urls.join('\n');
                return { ...prev, imagesText: current ? `${current}\n${addition}` : addition };
            });
            setNotice({ type: 'success', text: `Đã upload ${urls.length} ảnh` });
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Upload ảnh thất bại' });
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleDeleteProduct = (productId) => {
        setDeleteConfirmProductId(productId);
    };

    const confirmDeleteProduct = async () => {
        const productId = deleteConfirmProductId;
        if (!productId) return;
        try {
            await api.delete(`/products/${productId}`);
            const res = await api.get('/products');
            setProducts(res.data);
            setNotice({ type: 'success', text: 'Đã xoá sản phẩm' });
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Xoá sản phẩm thất bại' });
        } finally {
            setDeleteConfirmProductId(null);
        }
    };

    const handleSetVisibility = async (productId, isVisible) => {
        try {
            await api.put(`/products/${productId}`, { is_visible: isVisible });
            setProducts((prev) => prev.map((p) => p._id === productId ? { ...p, is_visible: isVisible } : p));
            setNotice({ type: 'success', text: isVisible ? 'Đã hiển thị sản phẩm' : 'Đã ẩn sản phẩm' });
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Cập nhật trạng thái hiển thị thất bại' });
        }
    };

    return (
        <AdminLayout
            title="Quản lý Sản phẩm"
           
            actions={
                <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-95">
                    <span className="material-symbols-outlined">add</span>
                    Thêm sản phẩm mới
                </button>
            }
        >
            <div className="text-left space-y-8">
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
                {/* Dashboard Stats / Quick Filters Bento */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-wrap gap-4 items-center">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mr-2">Bộ lọc nhanh:</span>
                        <button
                            onClick={() => setSelectedBrandFilterId('all')}
                            className={selectedBrandFilterId === 'all'
                                ? "px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
                                : "px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors"}
                        >
                            Tất cả
                        </button>
                        {brands.map((brand) => (
                            <button
                                key={brand._id}
                                onClick={() => setSelectedBrandFilterId(brand._id)}
                                className={selectedBrandFilterId === brand._id
                                    ? "px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
                                    : "px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors"}
                            >
                                {brand.name}
                            </button>
                        ))}
                        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                        <button
                            onClick={() => setSelectedStatusFilter((prev) => (prev === 'in' ? 'all' : 'in'))}
                            className={selectedStatusFilter === 'in'
                                ? "px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
                                : "px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors"}
                        >
                            Còn hàng
                        </button>
                        <button
                            onClick={() => setSelectedStatusFilter((prev) => (prev === 'out' ? 'all' : 'out'))}
                            className={selectedStatusFilter === 'out'
                                ? "px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
                                : "px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors"}
                        >
                            Hết hàng
                        </button>
                        <button
                            onClick={() => setSelectedStatusFilter((prev) => (prev === 'hidden' ? 'all' : 'hidden'))}
                            className={selectedStatusFilter === 'hidden'
                                ? "px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
                                : "px-4 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high rounded-full text-sm font-semibold transition-colors"}
                        >
                            Tạm ẩn
                        </button>
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
                                {paginatedProducts.map((product) => (
                                    <tr
                                        key={product._id}
                                        className={`hover:bg-slate-50/50 transition-colors group ${product.is_visible === false ? 'opacity-60 grayscale' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-lg bg-surface-container-low p-2 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-primary-fixed bg-primary ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}>
                                                    {product.images && product.images[0] ? <img src={getImageURL(product.images[0])} className="object-cover w-full h-full rounded" /> : product.name.charAt(0)}
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
                                                {product.is_visible === false ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetVisibility(product._id, true)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="Hiển thị"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetVisibility(product._id, false)}
                                                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                                                        title="Ẩn tạm"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">visibility_off</span>
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(product)}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-all"
                                                    title="Xoá"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedProducts.length === 0 && (
                                    <tr>
                                        <td className="px-6 py-10 text-center text-sm text-on-surface-variant" colSpan={6}>
                                            Không có sản phẩm nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pageCount > 1 && (
                        <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-end border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50"
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
                                            ? "w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold"
                                            : "w-8 h-8 rounded-lg hover:bg-white text-sm font-medium"}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.min(safePageCount, p + 1))}
                                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50"
                                    disabled={currentPage >= safePageCount}
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {deleteConfirmProductId && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirmProductId(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-outline-variant/20 shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-black text-on-surface">Xác nhận xoá</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">Bạn có chắc muốn xoá sản phẩm này không?</p>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmProductId(null)}
                                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-90 active:scale-95 transition-all"
                            >
                                Huỷ
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteProduct}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-black/40" onClick={closeCreate} />
                    <div className="relative w-full max-w-5xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/10 overflow-hidden">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/10">
                            <div>
                                <h3 className="text-xl font-black">{editingProductId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                                <p className="text-sm text-on-surface-variant mt-1">{editingProductId ? 'Chỉnh sửa thông tin sản phẩm.' : 'Nhập thông tin để thêm sản phẩm vào kho.'}</p>
                            </div>
                            <button type="button" onClick={closeCreate} className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-1 space-y-4">
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Ảnh sản phẩm</label>
                                <div className="rounded-2xl border border-outline-variant/20 bg-white p-4">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Danh sách URL ảnh (mỗi dòng 1 link)</label>
                                    <textarea
                                        value={createForm.imagesText}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, imagesText: e.target.value }))}
                                        className="mt-2 w-full bg-surface-container-low border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="https://...\nhttps://..."
                                        rows="8"
                                    />
                                    <div className="mt-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleUploadProductImages(e.target.files)}
                                            className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-surface-container-high file:px-4 file:py-2 file:text-xs file:font-bold file:text-on-surface hover:file:opacity-90"
                                            disabled={isUploadingImages}
                                        />
                                        {isUploadingImages && (
                                            <div className="mt-2 text-xs text-on-surface-variant">Đang upload...</div>
                                        )}
                                    </div>
                                    {parsedImages.length > 0 && (
                                        <div className="mt-3 text-xs text-on-surface-variant">
                                            Đã nhận {parsedImages.length} ảnh
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Tên sản phẩm</label>
                                        <input
                                            value={createForm.name}
                                            onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                                            className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                            placeholder="Ví dụ: iPhone 15 Pro Max"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Thương hiệu</label>
                                        <select
                                            value={createForm.brandId}
                                            onChange={(e) => setCreateForm((p) => ({ ...p, brandId: e.target.value }))}
                                            className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                        >
                                            <option value="">Chọn thương hiệu</option>
                                            {brands.map((b) => (
                                                <option key={b._id} value={b._id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Danh mục</label>
                                        <select
                                            value={createForm.categoryId}
                                            onChange={(e) => setCreateForm((p) => ({ ...p, categoryId: e.target.value }))}
                                            className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Giá niêm yết (VNĐ)</label>
                                        <input
                                            value={createForm.price}
                                            onChange={(e) => setCreateForm((p) => ({ ...p, price: e.target.value }))}
                                            className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Số lượng tồn kho</label>
                                        <input
                                            value={createForm.stock}
                                            onChange={(e) => setCreateForm((p) => ({ ...p, stock: e.target.value }))}
                                            className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Mô tả sản phẩm</label>
                                    <textarea
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                                        className="w-full bg-white border-none rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="Nhập đặc điểm nổi bật, thông số kỹ thuật..."
                                        rows="5"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                    <button type="button" onClick={closeCreate} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">Hủy bỏ</button>
                                    <button disabled={isSaving} className="px-8 py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:translate-y-[-1px] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                                        {isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
