const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cart.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.route('/:id')
    .put(updateCartItem)
    .delete(removeFromCart);

module.exports = router;
