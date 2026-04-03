const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
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

module.exports = router;
