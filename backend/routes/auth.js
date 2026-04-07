const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const User = require('../schemas/users');
const Role = require('../schemas/roles');
const Order = require('../schemas/orders');
const { protect, admin } = require('../utils/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });
        }

        const userRole = await Role.findOne({ name: 'USER' });
        if (!userRole) {
            return res.status(500).json({ msg: 'Lỗi cấu hình hệ thống: Chưa khởi tạo Roles' });
        }

        user = new User({ name, email, password, role_id: userRole._id });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        await user.populate('role_id');

        const payload = { user: { id: user.id, role: user.role_id.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (_error) {
        res.status(500).send('Lỗi máy chủ');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('role_id');
        if (!user) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không đúng' });
        }

        if (user.status === 'locked') {
            if (user.lockTime && user.lockTime > Date.now()) {
                return res.status(403).json({ msg: 'Tài khoản đã bị khóa' });
            }
            user.status = 'active';
            user.lockTime = undefined;
            user.loginCount = 0;
            await user.save();
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.loginCount = (user.loginCount || 0) + 1;
            if (user.loginCount === 3) {
                user.lockTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
                user.loginCount = 0;
                user.status = 'locked';
            }
            await user.save();
            return res.status(400).json({ msg: 'Thông tin đăng nhập không đúng' });
        }

        user.loginCount = 0;
        user.lockTime = undefined;
        if (user.status === 'locked') user.status = 'active';
        await user.save();

        const payload = { user: { id: user.id, role: user.role_id.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role_id.name,
                    avatar: user.avatar
                }
            });
        });
    } catch (_error) {
        res.status(500).send('Lỗi máy chủ');
    }
});

router.post('/google-login', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email }).populate('role_id');

        if (!user) {
            const userRole = await Role.findOne({ name: 'USER' });
            if (!userRole) {
                return res.status(500).json({ msg: 'Lỗi cấu hình hệ thống: Chưa khởi tạo Roles' });
            }

            const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
            user = new User({
                name,
                email,
                password: passwordHash,
                role_id: userRole._id,
                avatar: picture,
                status: 'active'
            });

            await user.save();
            await user.populate('role_id');
        }

        if (user.status === 'locked') {
            if (user.lockTime && user.lockTime > Date.now()) {
                return res.status(403).json({ msg: 'Tài khoản đã bị khóa' });
            }
            user.status = 'active';
            user.lockTime = undefined;
            user.loginCount = 0;
            await user.save();
        }

        const jwtPayload = { user: { id: user.id, role: user.role_id.name } };
        jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role_id.name,
                    avatar: user.avatar
                }
            });
        });
    } catch (_error) {
        res.status(400).json({ msg: 'Xác thực Google thất bại' });
    }
});

router.route('/profile').get(protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('role_id');
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role_id.name,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            status: user.status,
            is_vip: user.is_vip
        });
    } catch (_error) {
        res.status(500).send('Lỗi máy chủ');
    }
}).put(protect, async (req, res) => {
    const { name, phone, avatar, address } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (avatar) user.avatar = avatar;
        if (address) user.address = address;

        await user.save();
        const updatedUser = await User.findById(user.id).populate('role_id');

        res.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role_id.name,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone,
                address: updatedUser.address
            }
        });
    } catch (_error) {
        res.status(500).send('Lỗi máy chủ');
    }
});

router.put('/profile/password', protect, async (req, res) => {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
        return res.status(400).json({ msg: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Mật khẩu cũ không chính xác' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(new_password, salt);
        await user.save();

        res.json({ success: true, msg: 'Đổi mật khẩu thành công' });
    } catch (_error) {
        res.status(500).send('Lỗi máy chủ');
    }
});

router.get('/users', protect, admin, async (_req, res) => {
    try {
        const users = await User.find({}).select('-password').populate('role_id', 'name');
        const orderCounts = await Order.aggregate([{ $group: { _id: '$user_id', count: { $sum: 1 } } }]);
        const countByUserId = new Map(orderCounts.map((c) => [String(c._id), c.count]));
        res.json(users.map((u) => ({ ...u.toObject(), order_count: countByUserId.get(String(u._id)) || 0 })));
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi server khi fetch users' });
    }
});

router.put('/users/:id', protect, admin, async (req, res) => {
    const { name, email, phone, address, avatar, status, role, is_vip } = req.body;
    try {
        const user = await User.findById(req.params.id).populate('role_id', 'name');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const isSelf = String(user._id) === String(req.user?.id);
        const currentRoleName = user.role_id?.name;
        const nextStatus = status !== undefined ? String(status) : undefined;
        const nextRoleName = role !== undefined ? String(role).trim().toUpperCase() : undefined;
        const shouldChangeStatus = nextStatus !== undefined && nextStatus !== user.status;
        const shouldChangeRole = nextRoleName !== undefined && nextRoleName !== currentRoleName;

        if (isSelf && (shouldChangeStatus || shouldChangeRole)) {
            return res.status(400).json({ message: 'Không thể thay đổi trạng thái hoặc quyền của chính bạn' });
        }

        if (nextStatus !== undefined) {
            if (!['active', 'locked'].includes(nextStatus)) {
                return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
            }
            if (shouldChangeStatus && currentRoleName === 'ADMIN') {
                return res.status(400).json({ message: 'Không thể thay đổi trạng thái tài khoản quản trị' });
            }
            user.status = nextStatus;
        }

        if (nextRoleName !== undefined) {
            if (!['USER', 'ADMIN'].includes(nextRoleName)) {
                return res.status(400).json({ message: 'Quyền không hợp lệ' });
            }
            const nextRole = await Role.findOne({ name: nextRoleName }).select('_id name');
            if (!nextRole) {
                return res.status(500).json({ message: 'Chưa khởi tạo role trong hệ thống' });
            }
            user.role_id = nextRole._id;
            if (nextRoleName === 'ADMIN') {
                user.status = 'active';
            }
        }

        if (is_vip !== undefined) {
            if (typeof is_vip === 'boolean') {
                user.is_vip = is_vip;
            } else if (typeof is_vip === 'string') {
                user.is_vip = is_vip.trim().toLowerCase() === 'true';
            } else if (typeof is_vip === 'number') {
                user.is_vip = is_vip === 1;
            } else {
                user.is_vip = Boolean(is_vip);
            }
        }

        if (name !== undefined) user.name = String(name).trim();
        if (phone !== undefined) user.phone = String(phone).trim();
        if (address !== undefined) user.address = String(address).trim();
        if (avatar !== undefined) user.avatar = String(avatar).trim();

        if (email !== undefined) {
            const nextEmail = String(email).trim();
            if (nextEmail && nextEmail !== user.email) {
                const exists = await User.findOne({ email: nextEmail }).select('_id');
                if (exists) {
                    return res.status(400).json({ message: 'Email đã được sử dụng' });
                }
                user.email = nextEmail;
            }
        }

        await user.save();
        const updated = await User.findById(user._id).select('-password').populate('role_id', 'name');
        res.json(updated);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng' });
    }
});

module.exports = router;
