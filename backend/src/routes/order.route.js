const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
<<<<<<< HEAD
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getAllOrders
=======
    getAllOrders,
    getOrderById,
    updateOrderStatus
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
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

<<<<<<< HEAD
router.route('/:id/payment')
    .put(admin, updatePaymentStatus);

=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
module.exports = router;
