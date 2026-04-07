const jwt = require('jsonwebtoken');
const User = require('../schemas/users');

const optionalProtect = async (req, _res, next) => {
    if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
        return next();
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userRole = decoded?.user?.role;
        req.user = await User.findById(decoded.user.id).select('-password').populate('role_id');
    } catch (_error) {
        req.user = undefined;
        req.userRole = undefined;
    }

    next();
};

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userRole = decoded?.user?.role;

            req.user = await User.findById(decoded.user.id).select('-password').populate('role_id');

            if (!req.user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }

            next();
        } catch (_error) {
            return res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có quyền truy cập, thiếu token' });
    }
};

const admin = (req, res, next) => {
    if (req.userRole === 'ADMIN' || (req.user && req.user.role_id && req.user.role_id.name === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Bạn không có quyền quản trị để truy cập' });
    }
};

module.exports = { protect, optionalProtect, admin };
