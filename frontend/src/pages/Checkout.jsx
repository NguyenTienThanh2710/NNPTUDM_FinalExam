import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const PAYMENT_METHODS = [
    {
        id: 'cod',
        label: 'Tiền mặt khi nhận hàng (COD)',
        sublabel: 'Thanh toán khi bạn nhận được hàng',
        icon: 'payments',
    },
    {
        id: 'bank_transfer',
        label: 'Chuyển khoản ngân hàng',
        sublabel: 'Chuyển khoản qua ứng dụng ngân hàng (VietQR)',
        icon: 'account_balance',
    },
    {
        id: 'momo',
        label: 'Ví điện tử MoMo/ZaloPay',
        sublabel: 'Thanh toán nhanh chóng, an toàn',
        icon: 'account_balance_wallet',
    },
];

const Checkout = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    // Form state
    const [form, setForm] = useState({
        recipient_name: '',
        recipient_phone: '',
        recipient_email: '',
        province: '',
        district: '',
        ward: '',
        detail_address: '',
        payment_method: 'cod',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Cart and User Profile in parallel
                const [cartRes, userRes] = await Promise.allSettled([
                    api.get('/cart'),
                    api.get('/auth/me')
                ]);

                if (cartRes.status === 'fulfilled') {
                    const items = cartRes.value.data.items || [];
                    if (items.length === 0) {
                        navigate('/cart');
                        return;
                    }
                    setCartItems(items);
                } else {
                    navigate('/login');
                    return;
                }

                // Pre-fill user data if available
                if (userRes.status === 'fulfilled' && userRes.value.data) {
                    const userData = userRes.value.data;
                    setForm(prev => ({
                        ...prev,
                        recipient_name: userData.name || prev.recipient_name,
                        recipient_email: userData.email || prev.recipient_email,
                        recipient_phone: userData.phone || prev.recipient_phone,
                        detail_address: userData.address || prev.detail_address
                    }));
                }

                setLoadingCart(false);
            } catch (err) {
                console.error('Fetch Checkout Data Error:', err);
                navigate('/login');
            }
        };
        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.product_id.price * item.quantity,
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const errors = {};
        if (!form.recipient_name.trim()) errors.recipient_name = t('checkout.validation_name');
        if (!form.recipient_phone.trim()) errors.recipient_phone = t('checkout.validation_phone');
        if (!form.recipient_email.trim()) errors.recipient_email = t('checkout.validation_email');
        if (!form.detail_address.trim()) errors.detail_address = t('checkout.validation_address');

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError(Object.values(errors)[0]);
            return;
        }

        // Combine address parts
        const fullAddress = [
            form.detail_address,
            form.ward,
            form.district,
            form.province
        ].filter(Boolean).join(', ');

        setSubmitting(true);
        try {
            const res = await api.post('/orders', {
                payment_method: form.payment_method,
                shipping_address: fullAddress,
                recipient_name: form.recipient_name,
                recipient_email: form.recipient_email,
                recipient_phone: form.recipient_phone,
            });
            navigate(`/order-success/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || t('common.error'));
            setSubmitting(false);
        }
    };

    if (loadingCart) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
                    <p className="font-medium">{t('common.loading')}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10 pt-32 bg-slate-50 dark:bg-slate-950 min-h-screen text-left font-body">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{t('checkout.title')}</h1>
                <p className="text-slate-500 mt-2">{t('checkout.subtitle')}</p>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Checkout Details */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Section 1: Customer Info */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">1</span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('checkout.section_customer')}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_name')}</label>
                                    <input
                                        name="recipient_name"
                                        value={form.recipient_name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white ${fieldErrors.recipient_name ? 'border-red-500 bg-red-50/10' : 'border-slate-200 dark:border-slate-800'}`}
                                        placeholder={t('checkout.placeholder_name')}
                                        type="text"
                                    />
                                    {fieldErrors.recipient_name && <p className="text-xs text-red-500 font-medium">{fieldErrors.recipient_name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_phone')}</label>
                                    <input
                                        name="recipient_phone"
                                        value={form.recipient_phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white ${fieldErrors.recipient_phone ? 'border-red-500 bg-red-50/10' : 'border-slate-200 dark:border-slate-800'}`}
                                        placeholder={t('checkout.placeholder_phone')}
                                        type="tel"
                                    />
                                    {fieldErrors.recipient_phone && <p className="text-xs text-red-500 font-medium">{fieldErrors.recipient_phone}</p>}
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_email')}</label>
                                    <input
                                        name="recipient_email"
                                        value={form.recipient_email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white ${fieldErrors.recipient_email ? 'border-red-500 bg-red-50/10' : 'border-slate-200 dark:border-slate-800'}`}
                                        placeholder={t('checkout.placeholder_email')}
                                        type="email"
                                    />
                                    {fieldErrors.recipient_email && <p className="text-xs text-red-500 font-medium">{fieldErrors.recipient_email}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Shipping */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">2</span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('checkout.section_shipping')}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_province')}</label>
                                    <select
                                        name="province"
                                        value={form.province}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none appearance-none dark:text-white"
                                    >
                                        <option value="">{t('checkout.label_province')}</option>
                                        <option value="Hà Nội">Hà Nội</option>
                                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                        <option value="Đà Nẵng">Đà Nẵng</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_district')}</label>
                                    <input
                                        name="district"
                                        value={form.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="VD: Quận 1"
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_ward')}</label>
                                    <input
                                        name="ward"
                                        value={form.ward}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="VD: Phường Đa Kao"
                                        type="text"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('checkout.label_address')}</label>
                                    <textarea
                                        name="detail_address"
                                        value={form.detail_address}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white ${fieldErrors.detail_address ? 'border-red-500 bg-red-50/10' : 'border-slate-200 dark:border-slate-800'}`}
                                        placeholder={t('checkout.placeholder_address')}
                                        rows="2"
                                    ></textarea>
                                    {fieldErrors.detail_address && <p className="text-xs text-red-500 font-medium">{fieldErrors.detail_address}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Payment */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">3</span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('checkout.section_payment')}</h2>
                            </div>
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map(method => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer group ${form.payment_method === method.id
                                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={method.id}
                                            checked={form.payment_method === method.id}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        />
                                        <div className="ml-4 flex items-center gap-3">
                                            <span className={`material-symbols-outlined ${form.payment_method === method.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                                                {method.icon}
                                            </span>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{method.label}</p>
                                                <p className="text-xs text-slate-500">{method.sublabel}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('checkout.section_summary')}</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Product Items list */}
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex gap-4">
                                            <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                {item.product_id.images?.[0] ? (
                                                    <img src={item.product_id.images[0]} alt={item.product_id.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-slate-400 text-sm">image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.product_id.name}</h4>
                                                <p className="text-sm text-slate-500">
                                                    Số lượng: {item.quantity}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                                        {(item.product_id.price * item.quantity).toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>


                                {/* Calculation */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span>{t('checkout.summary_subtotal')}</span>
                                        <span className="font-medium">{subtotal.toLocaleString()}₫</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span>{t('checkout.summary_shipping')}</span>
                                        <span className="font-medium text-green-600">Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span>{t('checkout.summary_discount')}</span>
                                        <span className="font-medium text-green-600">-0₫</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{t('checkout.summary_total')}</span>
                                        <div className="text-right">
                                            <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">{subtotal.toLocaleString()}₫</span>
                                            <span className="text-xs text-slate-500">{t('checkout.vat_included')}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            {t('checkout.submitting')}
                                        </>
                                    ) : t('checkout.btn_submit')}
                                </button>
                                <p className="text-center text-xs text-slate-400">
                                    Bằng cách đặt hàng, bạn đồng ý với các <a className="underline" href="#">Điều khoản dịch vụ</a> của MobileStore.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default Checkout;
