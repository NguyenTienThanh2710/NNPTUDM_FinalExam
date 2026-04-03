const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Retrieve default USER role
        const userRole = await Role.findOne({ name: 'USER' });
        if (!userRole) {
            return res.status(500).json({ msg: 'Server setup error: Roles not defined' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            address: address || '',
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
        res.status(500).send('Server error');
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
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        // Check if account is active
        if (user.status === 'locked') {
            return res.status(403).json({ msg: 'Account is locked' });
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
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').populate('role_id', 'name');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi fetch users' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('role_id', 'name').select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar, address } = req.body;
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email đã được sử dụng' });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (address !== undefined) user.address = address;

        await user.save();
        await user.populate('role_id', 'name');

        res.json({ msg: 'Cập nhật profile thành công', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
        }

        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Mật khẩu hiện tại không chính xác' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ msg: 'Đổi mật khẩu thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    register,
    login,
    getUsers,
    getProfile,
    updateProfile,
    changePassword
};
