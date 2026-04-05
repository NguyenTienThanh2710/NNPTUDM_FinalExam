import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null);
    const [removeConfirmItemId, setRemoveConfirmItemId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const incoming = location.state?.notice;
        if (!incoming) return;
        setNotice(incoming);
        navigate(location.pathname, { replace: true, state: {} });
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 3000);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data.items || []);
            setLoading(false);
        } catch (_err) {
            setError('Không thể lấy thông tin giỏ hàng. Vui lòng đăng nhập.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);
    useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/profile');

            // ✅ AUTO FILL ĐỊA CHỈ
            if (res.data.address) {
                setShippingAddress(res.data.address);
            }
        } catch (err) {
            console.error('Lỗi lấy profile:', err);
        }
    };

    fetchUser();
}, []);

    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.put(`/cart/${id}`, { quantity: newQuantity });
            fetchCart();
        } catch (_err) {
            setNotice({ type: 'error', text: 'Cập nhật số lượng thất bại' });
        }
    };

    const handleRemoveItem = async (id) => {
        setRemoveConfirmItemId(id);
    };

    const confirmRemoveItem = async () => {
        const id = removeConfirmItemId;
        if (!id) return;
        try {
            await api.delete(`/cart/${id}`);
            fetchCart();
        } catch (_err) {
            setNotice({ type: 'error', text: 'Xóa sản phẩm thất bại' });
        } finally {
            setRemoveConfirmItemId(null);
        }
    };

    const handleCheckout = async (e) => {
        e?.preventDefault();
        if (!shippingAddress) {
            setNotice({ type: 'error', text: 'Vui lòng nhập địa chỉ giao hàng' });
            return;
        }

        try {
            await api.post('/orders', {
                shipping_address: shippingAddress,
                payment_method: paymentMethod
            });
            navigate('/orders', { state: { notice: { type: 'success', text: 'Đặt hàng thành công!' } } }); 
        } catch (err) {
            setNotice({ type: 'error', text: err.response?.data?.message || 'Đặt hàng thất bại' });
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.product_id.price * item.quantity), 0);
    };

    if (loading) {
        return <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">Đang tải giỏ hàng...</main>;
    }

    if (error) {
        return (
            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
                <div className="bg-error-container text-on-error-container p-6 rounded-xl">{error}</div>
            </main>
        );
    }

    const subtotal = calculateSubtotal();

    return (
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen text-left">
            {removeConfirmItemId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setRemoveConfirmItemId(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-outline-variant/20 shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-black text-on-surface">Xác nhận xoá</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?</p>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setRemoveConfirmItemId(null)}
                                className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold hover:opacity-90 active:scale-95 transition-all"
                            >
                                Huỷ
                            </button>
                            <button
                                type="button"
                                onClick={confirmRemoveItem}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-95 transition-all"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {notice && (
                <div className={`fixed top-24 right-6 z-50 max-w-sm w-[min(380px,calc(100vw-48px))] rounded-2xl px-4 py-3 shadow-xl border ${notice.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : notice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'}`}>
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
            {/* Page Title */}
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2">Giỏ Hàng Của Bạn</h1>
                <p className="text-secondary font-medium">Bạn có {cartItems.length} sản phẩm trong giỏ</p>
            </header>

            {cartItems.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center border border-dashed border-outline-variant rounded-3xl">
                    <span className="material-symbols-outlined text-outline text-6xl mb-4">shopping_cart</span>
                    <h3 className="text-2xl font-bold mb-4">Giỏ hàng trống</h3>
                    <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-all">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
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
                                            <div className="w-full h-full flex items-center justify-center text-outline">Chưa có ảnh</div>
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
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </button>
                                            </div>
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
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-on-surface mb-4 tracking-widest uppercase">Phương Thức Thanh Toán</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="cursor-pointer">
                                            <input 
                                                name="payment" 
                                                type="radio" 
                                                value="COD" 
                                                className="hidden peer" 
                                                checked={paymentMethod === 'COD'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-surface-container peer-checked:border-primary peer-checked:bg-primary-fixed bg-surface-container-low transition-all h-full">
                                                <span className="material-symbols-outlined mb-2 text-primary">payments</span>
                                                <span className="text-sm font-bold text-center">Tiền mặt (COD)</span>
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input 
                                                name="payment" 
                                                type="radio" 
                                                value="BANK_TRANSFER" 
                                                className="hidden peer" 
                                                checked={paymentMethod === 'BANK_TRANSFER'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-surface-container peer-checked:border-primary peer-checked:bg-primary-fixed bg-surface-container-low transition-all h-full">
                                                <span className="material-symbols-outlined mb-2 text-primary">account_balance</span>
                                                <span className="text-sm font-bold text-center">Chuyển khoản</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>

                    {/* Right: Order Summary */}
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
                                </div>
                                <div className="flex justify-between text-secondary">
                                    <span>Thuế VAT (8%)</span>
                                    <span>Đã bao gồm</span>
                                </div>
                            </div>
                            
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
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
};

export default Cart;
