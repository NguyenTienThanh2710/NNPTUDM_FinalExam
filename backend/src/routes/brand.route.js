const express = require('express');
const router = express.Router();
const {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
} = require('../controllers/brand.controller');

// We will add middleware for authorization later
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/').post(protect, admin, createBrand).get(getBrands);
router.route('/:id').get(getBrandById).put(protect, admin, updateBrand).delete(protect, admin, deleteBrand);

module.exports = router;
