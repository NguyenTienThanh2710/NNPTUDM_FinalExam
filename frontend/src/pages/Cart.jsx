import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data.items || []);
            setLoading(false);
<<<<<<< HEAD
        } catch (err) {
=======
        } catch (_err) {
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            setError('Không thể lấy thông tin giỏ hàng. Vui lòng đăng nhập.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.put(`/cart/${id}`, { quantity: newQuantity });
            fetchCart();
<<<<<<< HEAD
        } catch (err) {
=======
        } catch (_err) {
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            alert('Cập nhật số lượng thất bại');
        }
    };

    const handleRemoveItem = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            try {
                await api.delete(`/cart/${id}`);
                fetchCart();
<<<<<<< HEAD
            } catch (err) {
=======
            } catch (_err) {
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                alert('Xóa sản phẩm thất bại');
            }
        }
    };

<<<<<<< HEAD
=======
    const handleCheckout = async (e) => {
        e?.preventDefault();
        try {
            await api.post('/orders');
            alert('Đặt hàng thành công!');
            navigate('/orders'); 
        } catch (err) {
            alert(err.response?.data?.message || 'Đặt hàng thất bại');
        }
    };

>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.product_id.price * item.quantity), 0);
    };

    if (loading) {
<<<<<<< HEAD
        return (
            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary animate-pulse">shopping_cart</span>
                    <p className="text-secondary font-medium">Đang tải giỏ hàng...</p>
                </div>
            </main>
        );
=======
        return <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">Đang tải giỏ hàng...</main>;
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
    }

    if (error) {
        return (
            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
<<<<<<< HEAD
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
=======
                <div className="bg-error-container text-on-error-container p-6 rounded-xl">{error}</div>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            </main>
        );
    }

    const subtotal = calculateSubtotal();

    return (
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen text-left">
            {/* Page Title */}
            <header className="mb-12">
<<<<<<< HEAD
                <div className="flex items-center gap-3 mb-2">
                    <Link to="/products" className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Tiếp tục mua sắm
                    </Link>
                </div>
=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                <h1 className="text-4xl font-black tracking-tight mb-2">Giỏ Hàng Của Bạn</h1>
                <p className="text-secondary font-medium">Bạn có {cartItems.length} sản phẩm trong giỏ</p>
            </header>

            {cartItems.length === 0 ? (
<<<<<<< HEAD
                <div className="py-24 text-center flex flex-col items-center border border-dashed border-outline-variant rounded-3xl">
                    <span className="material-symbols-outlined text-outline text-7xl mb-5">shopping_cart</span>
                    <h3 className="text-2xl font-bold mb-3">Giỏ hàng đang trống</h3>
                    <p className="text-secondary mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
                    <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all">
=======
                <div className="py-20 text-center flex flex-col items-center border border-dashed border-outline-variant rounded-3xl">
                    <span className="material-symbols-outlined text-outline text-6xl mb-4">shopping_cart</span>
                    <h3 className="text-2xl font-bold mb-4">Giỏ hàng trống</h3>
                    <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-all">
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                        Đi mua sắm ngay
                    </Link>
                </div>
            ) : (
<<<<<<< HEAD
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Cart Items */}
                    <section className="lg:col-span-8 space-y-4">
                        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold tracking-tight">Sản Phẩm Đã Chọn</h2>
                                <span className="text-sm text-secondary font-medium">{cartItems.length} sản phẩm</span>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-6 hover:bg-slate-50/50 transition-colors">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
                                            {item.product_id.images && item.product_id.images[0] ? (
                                                <img
                                                    alt={item.product_id.name}
                                                    className="w-full h-full object-cover"
                                                    src={item.product_id.images[0]}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-outline">
                                                    <span className="material-symbols-outlined">image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow min-w-0">
                                            <Link
                                                to={`/products/${item.product_id._id}`}
                                                className="font-bold text-base hover:text-primary transition-colors line-clamp-1"
                                            >
                                                {item.product_id.name}
                                            </Link>
                                            <p className="text-sm text-secondary mt-0.5">
                                                {item.product_id.brand_id?.name || ''} {item.product_id.category_id?.name ? `· ${item.product_id.category_id.name}` : ''}
                                            </p>
                                            <p className="text-primary font-bold mt-1">
                                                {item.product_id.price.toLocaleString()} VNĐ
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <div className="flex items-center bg-slate-100 rounded-full p-1">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors text-slate-600"
                                                >
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                </button>
                                                <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors text-slate-600"
=======
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Cart Items */}
                    <section className="lg:col-span-8 space-y-6">
                        <div className="bg-surface-container-lowest p-8 rounded-xl space-y-8 shadow-sm">
                            <h2 className="text-xl font-bold tracking-tight border-b border-surface-container-high pb-4">Sản Phẩm Đã Chọn ({cartItems.length})</h2>
                            
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col md:flex-row gap-6 items-center pt-8 first:pt-0 first:border-0 border-t border-surface-container-high">
                                    <div className="w-32 h-32 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
                                        {item.product_id.images && item.product_id.images[0] ? (
                                            <img alt={item.product_id.name} className="w-full h-full object-cover" src={item.product_id.images[0]} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-outline">No img</div>
                                        )}
                                    </div>
                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-bold">
                                                <Link to={`/products/${item.product_id._id}`} className="hover:text-primary transition-colors">{item.product_id.name}</Link>
                                            </h3>
                                            <p className="text-lg font-bold text-primary">{item.product_id.price.toLocaleString()} VNĐ</p>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">{item.product_id.brand_id?.name || 'Thương hiệu'} | {item.product_id.category_id?.name || 'Danh mục'}</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-surface-container-highest rounded-full p-1">
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                </button>
                                                <span className="px-4 font-bold text-sm w-8 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </button>
                                            </div>
<<<<<<< HEAD

                                            {/* Line total */}
                                            <span className="font-bold text-sm w-24 text-right hidden sm:block">
                                                {(item.product_id.price * item.quantity).toLocaleString()} ₫
                                            </span>

                                            <button
                                                onClick={() => handleRemoveItem(item._id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                title="Xóa sản phẩm"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
=======
                                            <button 
                                                onClick={() => handleRemoveItem(item._id)}
                                                className="text-error flex items-center gap-1 text-sm font-semibold hover:opacity-80"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Form (Simplified) */}
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold tracking-tight mb-8">Thông Tin Giao Hàng</h2>
                            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-widest uppercase">Địa chỉ nhận hàng</label>
                                    <textarea 
                                        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary" 
                                        placeholder="Ví dụ: Số 1, đường 2, phường 3, quận 4, TP.HCM" 
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-on-surface mb-4 tracking-widest uppercase">Phương Thức Thanh Toán</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="cursor-pointer">
                                            <input name="payment" type="radio" value="cod" className="hidden peer" defaultChecked />
                                            <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-surface-container peer-checked:border-primary peer-checked:bg-primary-fixed bg-surface-container-low transition-all">
                                                <span className="material-symbols-outlined mb-2 text-primary">payments</span>
                                                <span className="text-sm font-bold text-center">Tiền mặt (COD)</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </form>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                        </div>
                    </section>

                    {/* Right: Order Summary */}
<<<<<<< HEAD
                    <aside className="lg:col-span-4 sticky top-28">
                        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-7 space-y-5">
                            <h2 className="text-lg font-bold tracking-tight">Tóm Tắt Đơn Hàng</h2>

                            {/* Item breakdown */}
                            <div className="space-y-3 text-sm">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between text-secondary">
                                        <span className="line-clamp-1 flex-1 mr-2">{item.product_id.name} × {item.quantity}</span>
                                        <span className="font-medium flex-shrink-0">{(item.product_id.price * item.quantity).toLocaleString()} ₫</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-secondary">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600 font-semibold">Miễn phí</span>
=======
                    <aside className="lg:col-span-4 sticky top-32">
                        <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6 shadow-sm border border-outline-variant/20">
                            <h2 className="text-xl font-bold tracking-tight">Tóm Tắt Đơn Hàng</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-secondary">
                                    <span>Tạm tính</span>
                                    <span>{subtotal.toLocaleString()} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-secondary">
                                    <span>Phí giao hàng</span>
                                    <span className="text-primary font-medium">Miễn phí</span>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                                </div>
                                <div className="flex justify-between text-secondary">
                                    <span>Thuế VAT (8%)</span>
                                    <span>Đã bao gồm</span>
                                </div>
                            </div>
<<<<<<< HEAD

                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-base">Tổng cộng</span>
                                    <span className="text-2xl font-black text-primary">{subtotal.toLocaleString()} ₫</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Tiến Hành Thanh Toán
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>

                            {/* Trust note */}
                            <div className="flex items-center justify-center gap-2 text-secondary text-xs">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                <span>Thanh toán bảo mật & an toàn</span>
                            </div>
                        </div>

                        {/* Promo / Badge */}
                        <div className="mt-4 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl mt-0.5">local_shipping</span>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Giao hàng miễn phí toàn quốc</p>
                                <p className="text-xs text-slate-500 mt-0.5">Bảo hành chính hãng 2 năm. Đổi trả trong 30 ngày.</p>
=======
                            
                            <div className="pt-6 border-t border-outline-variant/30">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-lg font-bold">Tổng cộng</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-primary">{subtotal.toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit"
                                    form="checkout-form"
                                    className="w-full bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Thanh Toán / Đặt Hàng
                                    <span className="material-symbols-outlined">lock</span>
                                </button>
                                
                                <div className="mt-6 flex items-center justify-center gap-4 text-secondary">
                                    <span class="material-symbols-outlined text-sm">verified_user</span>
                                    <p className="text-[10px] uppercase tracking-widest font-bold">Bảo Mật Kép & An Toàn</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-6 p-6 rounded-xl border-2 border-dashed border-surface-container flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl">shield</span>
                            <div>
                                <p className="text-sm font-bold">Bảo Đảm Lumina Premium</p>
                                <p className="text-xs text-secondary mt-1">Sản phẩm chính hãng với bảo hành VIP 2 năm và hỗ trợ 24/7.</p>
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
};

export default Cart;
