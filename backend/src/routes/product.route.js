const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const { protect, optionalProtect, admin } = require('../middleware/auth.middleware');

router.route('/').post(protect, admin, createProduct).get(optionalProtect, getProducts);
router.route('/:id').get(optionalProtect, getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
