const express = require('express');
const router = express.Router();
const { register, login, getUsers, updateUserByAdmin, googleLogin, getProfile, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST api/auth/google-login
// @desc    Authenticate user via Google
// @access  Public
router.post('/google-login', googleLogin);

// Profile routes
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

router.put('/profile/password', protect, changePassword);

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private/Admin
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').put(protect, admin, updateUserByAdmin);

module.exports = router;
