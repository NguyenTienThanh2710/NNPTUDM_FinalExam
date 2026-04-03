const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { name, email, password } = req.body;

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

<<<<<<< HEAD
// @desc    Get all users (Admin only)
=======
// @desc    Get all users
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').populate('role_id', 'name');
        res.json(users);
<<<<<<< HEAD
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('role_id', 'name');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi fetch profile' });
=======
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi fetch users' });
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
    }
};

module.exports = {
    register,
    login,
<<<<<<< HEAD
    getUsers,
    getMe
=======
    getUsers
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
};
