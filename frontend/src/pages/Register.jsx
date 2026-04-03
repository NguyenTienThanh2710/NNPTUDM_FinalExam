import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

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

    return (
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-200px)] py-20 relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
            </div>

            {/* Register Container */}
            <div className="relative z-10 w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(26,28,29,0.04)] ring-1 ring-outline-variant/10">
                {/* Branding Side (Editorial) */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-surface-container-low relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#003ec7] to-[#0052ff] rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-primary">Voltage Premium Admin</span>
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
                                <img alt="User" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD4atYeCDTTm5LxjZ1CoWEE-g2KrsjajX5_VfgSSuRf3tX1q-2xOsaJNe6a-nAL38R9VK2BcjnE9TRdF1wV0G8l4ffBGhSxntd01UMVVzBYZeXNag2yXHbCJlIGYlil3BolLrH4IG2a6Jz0kbpHSPPMlxhlC-1MjzPjnPn4XLZFNoLZOp9c4MdLpNE_efN6ULO9BUTHqUhxYvsRyGh0jfayB0bBKktDFm1a0v3r08ZrMgN7UUSE3AJldwkFIRxmMRfMzPu50HLfw" />
                                <img alt="User" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB97XNV5A6nXmwyjbo7o2mT880wc0MQ7pEATnXavYLa5ciBjjxWytJQStT2R1ICrPzUI86BYm2LcSgN-78XudFBOLpOaztiYKluYpsPtIsl-n3CBFspFalbIhbNPDgsz0WQU8rcR0JsU9glqDbc-cOohyrMHG6vv_Ta0C1Gjsvz1IA5Zmtukzs3WO8OHKO-grxObfJu0CH27iRaA_mVsWi_QjriX1_cVbr8A1egjaGZvgYodLoFUwUtfBCDjR8qURspIHsmuQMBeQ" />
                                <img alt="User" className="w-10 h-10 rounded-full border-2 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj9jNApetgO_MMs7Tii85z3tSQjbgsLO4heoVPcuRIu8jxx2_juHixnXNLYXM4MX4RCmATh1Ot54US29vaWtOIM6unKmKIkY4Ntoi2MrfLL65l0UaNLUM4meZrJmrCpylfCuI6pb7NNyvCS2UpfFK8GVpEjTQoMsZMhzUJn9_hjsB14mI3IDCandR0C2-0A3JkSfFBx9mGONNxUuRYdDpg_wAsh-mTr9t-NWoJme68rWoFhyKLH3dICT5ZLqxgeyKst0LU3QioPw" />
                            </div>
                            <span className="text-sm text-secondary font-medium tracking-wide">+10.000 người đã đăng ký</span>
                        </div>
                    </div>
                    {/* Abstract Background Image */}
                    <div className="absolute -right-20 bottom-0 w-80 h-80 opacity-20 transform translate-y-10 translate-x-10">
                        <img alt="Phone detail" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAbsuhpd9U9C4z_M33Hb759vBNDWJZjbhgxNwHae4tkXq_y02CRPBI7pPG7kSkydd5GxRk9sa6JHSfEiFs645JMJ3gb4UC8SMu7o9cIIPYzT5rDtmS-RFvL-dORuJldgkZBeH9x3ao287-3rs8-ZhNWOrW13XO8NigNa0xtCYmq_4mCFR9S8Xd5xDp2W1a2rkk27fVzyWoeF-PRRDZrRzH53_FGO6F2zCllHuvAtnMnh_MFNcphvhewEbe4vFzngw0N1zTHJ-aSQ" />
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-bold text-on-surface mb-2">Tạo tài khoản mới</h2>
                        <p className="text-base text-secondary">Vui lòng điền đầy đủ thông tin bên dưới.</p>
                    </div>

                    {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                            {/* Full Name */}
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
                            {/* Phone Number */}
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

                        {/* Password */}
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
                        <p className="text-center text-xs text-outline font-semibold tracking-widest uppercase mb-6">Hoặc tiếp tục với</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface font-medium border border-outline-variant/5">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.22-1.76 4.18-1.04 1.04-2.68 2.18-5.52 2.18-4.46 0-8.08-3.62-8.08-8.08s3.62-8.08 8.08-8.08c2.42 0 4.22.96 5.54 2.22l2.32-2.32C19.16 2.36 16.32 1 12.48 1 5.86 1 .5 6.36.5 13s5.36 12 11.98 12c3.6 0 6.32-1.18 8.44-3.4 2.18-2.18 2.88-5.26 2.88-7.68 0-.74-.06-1.44-.18-2.1l-10.64.1z" fill="#EA4335"></path>
                                </svg>
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface font-medium border border-outline-variant/5">
                                <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24">
                                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.002-.156-3.753 1.04-4.51 1.04zm3.091-4.831c.844-1.027 1.416-2.454 1.26-3.87-1.221.051-2.701.818-3.571 1.844-.78.91-1.469 2.364-1.287 3.753 1.35.104 2.753-.701 3.598-1.727z"></path>
                                </svg>
                                <span>Apple</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
