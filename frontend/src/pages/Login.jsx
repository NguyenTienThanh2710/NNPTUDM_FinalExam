import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAuthUser } from '../utils/auth';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Notify Header to update
            window.dispatchEvent(new Event('authChange'));
            const user = getAuthUser();
            if (user?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/products');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Email hoặc mật khẩu không đúng');
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
            setNotice({ type: 'success', text: 'Đăng nhập thành công! Chào mừng ' + (res.data.user?.name || 'bạn') });
            
            // Re-fetch user or check role
            const user = getAuthUser();
            if (user?.role === 'ADMIN') {
                window.setTimeout(() => navigate('/admin'), 600);
            } else {
                window.setTimeout(() => navigate('/products'), 600);
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
                <span className="text-sm font-bold">Quay lại</span>
            </Link>

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
            <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 min-h-[700px]">
                <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary-container text-white relative overflow-hidden">
                    <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-12">
                            <span className="material-symbols-outlined text-3xl font-bold">bolt</span>
                            <span className="text-2xl font-extrabold tracking-tighter">VOLTAGE</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
                            Trải nghiệm <br /> <span className="opacity-70">Công nghệ</span> <br /> Đỉnh cao.
                        </h1>
                        <p className="text-lg opacity-80 max-w-md font-light leading-relaxed">
                            Khám phá thế giới smartphone cao cấp với những ưu đãi đặc quyền dành riêng cho thành viên Voltage Premium.
                        </p>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <div className="relative group">
                            <div className="w-full h-72 bg-white/5 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center placeholder">
                                <span className="material-symbols-outlined text-5xl opacity-50">smartphone</span>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                <span className="text-sm font-bold block mb-1">MỚI NHẤT</span>
                                <span className="text-2xl font-bold">Galaxy S24 Ultra</span>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-surface-container-lowest">
                    <div className="max-w-md w-full mx-auto text-left">
                        <header className="mb-10 text-center lg:text-left">
                            <div className="lg:hidden flex justify-center mb-6">
                                <div className="bg-primary/10 p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-on-surface mb-2">Chào mừng trở lại</h2>
                            <p className="text-secondary font-medium">Vui lòng đăng nhập vào tài khoản của bạn</p>
                        </header>
                        
                        {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">{error}</div>}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1" htmlFor="email">Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                                    <input 
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/60" 
                                        id="email" 
                                        name="email" 
                                        type="email"
                                        placeholder="example@gmail.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="password">Mật khẩu</label>
                                    <a className="text-xs font-semibold text-primary hover:underline underline-offset-4" href="#">Quên mật khẩu?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                                    <input 
                                        className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/60" 
                                        id="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 px-1">
                                <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
                                <label className="text-sm font-medium text-secondary" htmlFor="remember">Ghi nhớ đăng nhập</label>
                            </div>
                            
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
                                Đăng nhập
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </form>
                        
                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-container-highest"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-surface-container-lowest px-4 text-outline">Hoặc đăng nhập bằng</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mb-6">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="filled_blue"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                        
                        <p className="mt-10 text-center text-secondary font-medium">
                            Chưa có tài khoản? 
                            <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/register">Đăng ký ngay</Link>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Login;
