import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems = [] } = location.state || {};

    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Locations data
    const [locations, setLocations] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (selectedItems.length === 0) {
            navigate('/cart');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch locations
                const locRes = await api.get('/locations');
                setLocations(locRes.data);

                // Fetch user profile
                const res = await api.get('/auth/profile');
                if (res.data.phone) setPhoneNumber(res.data.phone);
                
                // If user has a saved address, we could try to parse it or just leave it for now
                // For this implementation, we'll let them select from dropdowns
            } catch (err) {
                console.error('Lỗi lấy dữ liệu:', err);
            }
        };
        fetchData();
    }, [selectedItems, navigate]);

    // Handle City change
    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setCity(cityName);
        setDistrict('');
        setWard('');
        
        const selectedCity = locations.find(l => l.name === cityName);
        setDistricts(selectedCity ? selectedCity.districts : []);
        setWards([]);
    };

    // Handle District change
    const handleDistrictChange = (e) => {
        const districtName = e.target.value;
        setDistrict(districtName);
        setWard('');

        const selectedDistrict = districts.find(d => d.name === districtName);
        setWards(selectedDistrict ? selectedDistrict.wards : []);
    };

    const calculateSubtotal = () => {
        return selectedItems.reduce((total, item) => total + (item.product_id.price * item.quantity), 0);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/orders', {
                city,
                district,
                ward,
                street_address: streetAddress,
                phone_number: phoneNumber,
                payment_method: paymentMethod,
                item_ids: selectedItems.map(item => item._id)
            });
            navigate('/orders', { 
                state: { notice: { type: 'success', text: 'Đặt hàng thành công!' } } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const subtotal = calculateSubtotal();

    return (
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen text-left">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2">Thanh Toán</h1>
                <p className="text-secondary font-medium">Hoàn tất thông tin để nhận hàng</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left: Shipping Form */}
                <section className="lg:col-span-7 space-y-8">
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                        <h2 className="text-xl font-bold tracking-tight mb-8">Thông Tin Giao Hàng</h2>
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* City */}
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-widest uppercase">Thành phố / Tỉnh</label>
                                    <select 
                                        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary appearance-none"
                                        value={city}
                                        onChange={handleCityChange}
                                        required
                                    >
                                        <option value="">Chọn Thành phố</option>
                                        {locations.map(loc => (
                                            <option key={loc.name} value={loc.name}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-widest uppercase">Quận / Huyện</label>
                                    <select 
                                        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary appearance-none"
                                        value={district}
                                        onChange={handleDistrictChange}
                                        disabled={!city}
                                        required
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map(d => (
                                            <option key={d.name} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ward */}
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-widest uppercase">Phường / Xã</label>
                                    <select 
                                        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary appearance-none"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                        disabled={!district}
                                        required
                                    >
                                        <option value="">Chọn Phường/Xã</option>
                                        {wards.map(w => (
                                            <option key={w} value={w}>{w}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-on-surface mb-2 tracking-widest uppercase">Số điện thoại nhận hàng</label>
                                    <input 
                                        type="tel"
                                        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary" 
                                        placeholder="Nhập số điện thoại" 
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Street Address */}
                            <div>
                                <label className="block text-xs font-bold text-on-surface mb-2 tracking-widest uppercase">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                                <textarea 
                                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary" 
                                    placeholder="Ví dụ: Số 123, đường ABC..." 
                                    rows="2"
                                    required
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                ></textarea>
                            </div>
                            <div>
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

                    <Link to="/cart" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Quay lại giỏ hàng
                    </Link>
                </section>

                {/* Right: Order Summary */}
                <aside className="lg:col-span-5 sticky top-32">
                    <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6 shadow-sm border border-outline-variant/20">
                        <h2 className="text-xl font-bold tracking-tight">Sản phẩm đã chọn</h2>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {selectedItems.map((item) => (
                                <div key={item._id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.product_id.images?.[0]} alt={item.product_id.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-bold truncate max-w-[180px]">{item.product_id.name}</p>
                                        <p className="text-xs text-secondary">SL: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">{(item.product_id.price * item.quantity).toLocaleString()} VNĐ</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-outline-variant/30 space-y-4">
                            <div className="flex justify-between text-secondary">
                                <span>Tạm tính</span>
                                <span>{subtotal.toLocaleString()} VNĐ</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Phí giao hàng</span>
                                <span className="text-primary font-medium">Miễn phí</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="text-lg font-bold">Tổng cộng</span>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-primary">{subtotal.toLocaleString()} VNĐ</p>
                                </div>
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className={`w-full bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Đang xử lý...' : 'Xác nhận Đặt Hàng'}
                                {!loading && <span className="material-symbols-outlined">check_circle</span>}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Checkout;
