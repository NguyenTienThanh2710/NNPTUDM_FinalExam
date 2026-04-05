import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { getAuthUser } from '../utils/auth';

const Register = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!termsAgreed) {
            setError('Vui lòng đồng ý với Điều khoản & Chính sách');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            await api.post('/auth/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Đã có lỗi xảy ra');
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await api.post('/auth/google-login', { 
                credential: response.credential 
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Notify Header to update
            window.dispatchEvent(new Event('authChange'));
            
            // Re-fetch user or check role
            const user = getAuthUser();
            if (user?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/products');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
        }
    };

    const handleGoogleError = () => {
        setError('Có lỗi xảy ra trong quá trình đăng nhập bằng Google.');
    };

    return (
        <div className="flex items-center justify-center p-4 min-h-screen py-10 relative bg-surface">
            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-full transition-all border border-outline-variant/10 shadow-sm z-50 group"
            >
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                <span className="text-sm font-bold">Trang chủ</span>
            </Link>

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
            </div>

            {/* Khung đăng ký */}
            <div className="relative z-10 w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(26,28,29,0.04)] ring-1 ring-outline-variant/10">
                {/* Khối thương hiệu */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-surface-container-low relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-primary">Voltage Premium Quản trị</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-on-surface tracking-tight">
                            Trải nghiệm công nghệ <br /> <span className="text-primary">đỉnh cao</span> trong tầm tay.
                        </h1>
                        <p className="text-lg text-secondary leading-relaxed max-w-sm">
                            Gia nhập cộng đồng người dùng sở hữu những thiết bị di động tiên tiến nhất thế giới.
                        </p>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <div className="flex gap-4 items-center">
                            <div className="flex -space-x-3">
                                <img alt="Người dùng" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD4atYeCDTTm5LxjZ1CoWEE-g2KrsjajX5_VfgSSuRf3tX1q-2xOsaJNe6a-nAL38R9VK2BcjnE9TRdF1wV0G8l4ffBGhSxntd01UMVVzBYZeXNag2yXHbCJlIGYlil3BolLrH4IG2a6Jz0kbpHSPPMlxhlC-1MjzPjnPn4XLZFNoLZOp9c4MdLpNE_efN6ULO9BUTHqUhxYvsRyGh0jfayB0bBKktDFm1a0v3r08ZrMgN7UUSE3AJldwkFIRxmMRfMzPu50HLfw" />
                                <img alt="Người dùng" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB97XNV5A6nXmwyjbo7o2mT880wc0MQ7pEATnXavYLa5ciBjjxWytJQStT2R1ICrPzUI86BYm2LcSgN-78XudFBOLpOaztiYKluYpsPtIsl-n3CBFspFalbIhbNPDgsz0WQU8rcR0JsU9glqDbc-cOohyrMHG6vv_Ta0C1Gjsvz1IA5Zmtukzs3WO8OHKO-grxObfJu0CH27iRaA_mVsWi_QjriX1_cVbr8A1egjaGZvgYodLoFUwUtfBCDjR8qURspIHsmuQMBeQ" />
                                <img alt="Người dùng" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj9jNApetgO_MMs7Tii85z3tSQjbgsLO4heoVPcuRIu8jxx2_juHixnXNLYXM4MX4RCmATh1Ot54US29vaWtOIM6unKmKIkY4Ntoi2MrfLL65l0UaNLUM4meZrJmrCpylfCuI6pb7NNyvCS2UpfFK8GVpEjTQoMsZMhzUJn9_hjsB14mI3IDCandR0C2-0A3JkSfFBx9mGONNxUuRYdDpg_wAsh-mTr9t-NWoJme68rWoFhyKLH3dICT5ZLqxgeyKst0LU3QioPw" />
                            </div>
                            <span className="text-sm text-secondary font-medium tracking-wide">+10.000 người đã đăng ký</span>
                        </div>
                    </div>
                    {/* Ảnh nền minh hoạ */}
                    <div className="absolute -right-20 bottom-0 w-80 h-80 opacity-20 transform translate-y-10 translate-x-10">
                        <img alt="Chi tiết sản phẩm" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAbsuhpd9U9C4z_M33Hb759vBNDWJZjbhgxNwHae4tkXq_y02CRPBI7pPG7kSkydd5GxRk9sa6JHSfEiFs645JMJ3gb4UC8SMu7o9cIIPYzT5rDtmS-RFvL-dORuJldgkZBeH9x3ao287-3rs8-ZhNWOrW13XO8NigNa0xtCYmq_4mCFR9S8Xd5xDp2W1a2rkk27fVzyWoeF-PRRDZrRzH53_FGO6F2zCllHuvAtnMnh_MFNcphvhewEbe4vFzngw0N1zTHJ-aSQ" />
                    </div>
                </div>

                {/* Khối biểu mẫu */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-bold text-on-surface mb-2">Tạo tài khoản mới</h2>
                        <p className="text-base text-secondary">Vui lòng điền đầy đủ thông tin bên dưới.</p>
                    </div>

                    {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                            {/* Họ và tên */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-on-surface-variant tracking-wide uppercase">Họ và tên</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                                        placeholder="Nguyễn Văn A" 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {/* Số điện thoại */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-on-surface-variant tracking-wide uppercase">Số điện thoại</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                                        placeholder="0901 234 567" 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-semibold text-on-surface-variant tracking-wide uppercase">Địa chỉ Email</label>
                            <div className="relative group">
                                <input 
                                    className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                                    placeholder="example@gmail.com" 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-semibold text-on-surface-variant tracking-wide uppercase">Mật khẩu</label>
                            <div className="relative group">
                                <input 
                                    className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                                    placeholder="••••••••" 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-semibold text-on-surface-variant tracking-wide uppercase">Xác nhận mật khẩu</label>
                            <div className="relative group">
                                <input 
                                    className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                                    placeholder="••••••••" 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-3 pt-2 text-left">
                            <input 
                                className="w-5 h-5 rounded border-surface-container-highest text-primary focus:ring-primary/20 bg-surface-container-highest" 
                                id="terms" 
                                type="checkbox" 
                                checked={termsAgreed}
                                onChange={(e) => setTermsAgreed(e.target.checked)}
                            />
                            <label className="text-sm text-secondary" htmlFor="terms">Tôi đồng ý với <a className="text-primary font-medium hover:underline" href="#">Điều khoản & Chính sách</a></label>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-br from-[#003ec7] to-[#0052ff] text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-4 flex items-center justify-center gap-2" type="submit">
                            <span>Đăng ký ngay</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        <span className="text-sm text-secondary">Đã có tài khoản?</span>
                        <Link className="text-primary font-bold hover:underline" to="/login">Đăng nhập</Link>
                    </div>

                    {/* Social Register */}
                    <div className="mt-10 pt-8 border-t border-outline-variant/10">
                        <p className="text-center text-xs text-outline font-semibold tracking-widest uppercase mb-6">Hoặc đăng ký bằng</p>
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="filled_blue"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
