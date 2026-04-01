const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const { protect, admin } = require('../middleware/auth.middleware');

router.route('/').post(protect, admin, createProduct).get(getProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
