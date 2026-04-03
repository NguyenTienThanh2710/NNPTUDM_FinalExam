const express = require('express');
const router = express.Router();
const { register, login, getUsers, getProfile, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private/Admin
router.route('/users').get(protect, admin, getUsers);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, changePassword);

module.exports = router;
