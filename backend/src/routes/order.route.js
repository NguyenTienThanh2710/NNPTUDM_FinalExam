const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getDashboardStats,
    cancelOrder
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

router.route('/:id/cancel')
    .put(cancelOrder);

router.route('/:id/status')
    .put(admin, updateOrderStatus);

router.route('/:id/payment')
    .put(admin, updatePaymentStatus);

module.exports = router;
