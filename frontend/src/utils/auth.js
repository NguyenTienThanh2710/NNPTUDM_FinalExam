import { jwtDecode } from 'jwt-decode';

export const getAuthUser = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        const decoded = jwtDecode(token);
        
        // Ensure token has not expired
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return null;
        }

        return decoded.user; // contains { id, role }
    } catch {
        return null;
    }
};

export const isAdminUser = () => {
    const user = getAuthUser();
    return user?.role === 'ADMIN';
};
