import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getImageURL } from '../utils/imageUtils';

const Profile = () => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', avatar: '', role: '' };
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('user');
        const parsed = saved ? JSON.parse(saved) : null;
        return {
            name: parsed?.name || '',
            phone: parsed?.phone || '',
            avatar: parsed?.avatar || ''
        };
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setUser(res.data);
                setFormData({
                    name: res.data.name,
                    phone: res.data.phone || '',
                    avatar: res.data.avatar || ''
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/profile', formData);
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.dispatchEvent(new Event('authChange'));
                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
                setIsEditing(false);
            }
        } catch (_err) {
            setMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
            return;
        }
        try {
            const res = await api.put('/auth/profile/password', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            if (res.data.success) {
                setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                window.setTimeout(() => setIsPasswordModalOpen(false), 2000);
            }
        } catch (err) {
            setPasswordMessage({ type: 'error', text: err.response?.data?.msg || 'Đổi mật khẩu thất bại' });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <main className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-container p-8 h-48 relative">
                    <div className="absolute -bottom-16 left-12">
                        <div className="relative group">
                            <img 
                                src={getImageURL(user.avatar) || 'https://i.pravatar.cc/150?img=12'} 
                                alt={user.name} 
                                className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-800 object-cover shadow-lg"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-12 px-12">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-on-surface tracking-tight">{user.name}</h1>
                            <p className="text-primary font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                {user.role} Account
                            </p>
                        </div>
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Chỉnh sửa thông tin
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="bg-slate-100 dark:bg-slate-800 text-on-surface-variant px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                            >
                                Hủy bỏ
                            </button>
                        )}
                    </div>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span className="material-symbols-outlined text-sm">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Tên hiển thị</label>
                            <input 
                                type="text"
                                name="name"
                                value={isEditing ? formData.name : user.name}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                className={`w-full px-6 py-4 rounded-2xl border-none transition-all ${isEditing ? 'bg-surface-container focus:ring-2 focus:ring-primary' : 'bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Email (Không thể thay đổi)</label>
                            <input 
                                type="email"
                                value={user.email}
                                readOnly
                                className="w-full px-6 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Số điện thoại</label>
                            <input 
                                type="text"
                                name="phone"
                                placeholder="Chưa cập nhật"
                                value={isEditing ? formData.phone : (user.phone || '')}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                className={`w-full px-6 py-4 rounded-2xl border-none transition-all ${isEditing ? 'bg-surface-container focus:ring-2 focus:ring-primary' : 'bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Avatar URL (Link kiểu .jpg, .png)</label>
                            <input 
                                type="text"
                                name="avatar"
                                value={isEditing ? formData.avatar : (user.avatar || '')}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                placeholder="Dán link ảnh trực tiếp vào đây"
                                className={`w-full px-6 py-4 rounded-2xl border-none transition-all ${isEditing ? 'bg-surface-container focus:ring-2 focus:ring-primary' : 'bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed'}`}
                            />
                        </div>

                        {isEditing && (
                            <div className="md:col-span-2 pt-6">
                                <button type="submit" className="w-full md:w-auto bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
                                    Lưu thay đổi ngay
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-surface-container-low border border-outline-variant/10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                                    <span className="material-symbols-outlined text-4xl">lock_reset</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-on-surface">Bảo mật tài khoản</h3>
                                    <p className="text-sm text-on-surface-variant font-medium mt-1">Nên cập nhật mật khẩu định kỳ để bảo vệ tài khoản.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-full md:w-auto px-8 py-4 bg-on-surface text-surface rounded-2xl font-black hover:opacity-90 transition-all active:scale-95"
                            >
                                Đổi mật khẩu ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)} />
                    <div className="relative w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 border border-outline-variant/20 shadow-2xl overflow-hidden p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black tracking-tight">Đổi mật khẩu</h2>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-outline-variant hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {passwordMessage.text && (
                            <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                <span className="material-symbols-outlined text-sm">{passwordMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                                {passwordMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Mật khẩu cũ</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                                    value={passwordData.old_password}
                                    onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Mật khẩu mới</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">Nhập lại mật khẩu mới</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                                    value={passwordData.confirm_password}
                                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 mt-4">
                                Xác nhận thay đổi
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Profile;
