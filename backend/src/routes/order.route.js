const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getAllOrders
} = require('../controllers/order.controller');

const { protect, admin } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .post(createOrder)
    .get(getOrders);

router.route('/all')
    .get(admin, getAllOrders);

router.route('/:id')
    .get(getOrderById);

router.route('/:id/status')
    .put(admin, updateOrderStatus);

router.route('/:id/payment')
    .put(admin, updatePaymentStatus);

module.exports = router;
