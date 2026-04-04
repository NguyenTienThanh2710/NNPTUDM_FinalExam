const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getDashboardStats
} = require('../controllers/order.controller');

const { protect, admin } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .post(createOrder)
    .get(getOrders);

router.route('/all')
    .get(admin, getAllOrders);

router.route('/dashboard')
    .get(admin, getDashboardStats);

router.route('/:id')
    .get(getOrderById);

router.route('/:id/status')
    .put(admin, updateOrderStatus);

module.exports = router;
