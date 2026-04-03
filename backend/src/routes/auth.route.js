const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { register, login, getUsers, getMe } = require('../controllers/auth.controller');
=======
const { register, login, getUsers } = require('../controllers/auth.controller');
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
const { protect, admin } = require('../middleware/auth.middleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

<<<<<<< HEAD
// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, getMe);

=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
// @route   GET api/auth/users
// @desc    Get all users
// @access  Private/Admin
router.route('/users').get(protect, admin, getUsers);

module.exports = router;
