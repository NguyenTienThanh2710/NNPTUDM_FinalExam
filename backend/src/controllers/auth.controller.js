const User = require('../models/user.model');
const Role = require('../models/role.model');
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });
        }

        // Retrieve default USER role
        const userRole = await Role.findOne({ name: 'USER' });
        if (!userRole) {
            return res.status(500).json({ msg: 'Lỗi cấu hình hệ thống: Chưa khởi tạo Roles' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            role_id: userRole._id
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        await user.populate('role_id');

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role_id.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // We will need to set this up later
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email }).populate('role_id');

        if (!user) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không đúng' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không đúng' });
        }
        
        // Check if account is active
        if (user.status === 'locked') {
            return res.status(403).json({ msg: 'Tài khoản đã bị khóa' });
        }

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role_id.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // We will need to set this up later
            { expiresIn: '5h' },
            (err, token) => {
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
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').populate('role_id', 'name');
        const orderCounts = await Order.aggregate([
            { $group: { _id: '$user_id', count: { $sum: 1 } } }
        ]);
        const countByUserId = new Map(orderCounts.map((c) => [String(c._id), c.count]));
        res.json(users.map((u) => ({ ...u.toObject(), order_count: countByUserId.get(String(u._id)) || 0 })));
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi fetch users' });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = async (req, res) => {
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
            // Register new user from Google info
            const userRole = await Role.findOne({ name: 'USER' });
            if (!userRole) {
                return res.status(500).json({ msg: 'Lỗi cấu hình hệ thống: Chưa khởi tạo Roles' });
            }

            // Create new user (random password since they login via Google)
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

        // Check if account is active
        if (user.status === 'locked') {
            return res.status(403).json({ msg: 'Tài khoản đã bị khóa' });
        }

        // Create and return JWT
        const jwtPayload = {
            user: {
                id: user.id,
                role: user.role_id.name
            }
        };

        jwt.sign(
            jwtPayload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
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
            }
        );

    } catch (err) {
        console.error('Lỗi đăng nhập Google:', err.message);
        res.status(400).json({ msg: 'Xác thực Google thất bại' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
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
            status: user.status
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    const { name, phone, avatar } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone; // Assuming phone field exists or adding it
        if (avatar) user.avatar = avatar;

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
                phone: updatedUser.phone
            }
        });
    } catch (err) {
        console.error('Lỗi cập nhật hồ sơ:', err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

module.exports = {
    register,
    login,
    getUsers,
    googleLogin,
    updateProfile,
    getProfile
};
