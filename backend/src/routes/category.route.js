const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');

const { protect, admin } = require('../middleware/auth.middleware');

router.route('/').post(protect, admin, createCategory).get(getCategories);
router.route('/:id').get(getCategoryById).put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);

module.exports = router;
