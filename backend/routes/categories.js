const express = require('express');
const router = express.Router();
const Category = require('../schemas/categories');
const Product = require('../schemas/products');
const { protect, admin } = require('../utils/auth');

router.route('/').post(protect, admin, async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = new Category({ name, description });
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).get(async (_req, res) => {
    try {
        const categories = await Category.find({});
        const counts = await Product.aggregate([
            { $group: { _id: '$category_id', count: { $sum: 1 } } }
        ]);
        const countByCategoryId = new Map(counts.map((c) => [String(c._id), c.count]));
        res.json(categories.map((c) => ({ ...c.toObject(), product_count: countByCategoryId.get(String(c._id)) || 0 })));
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).put(protect, admin, async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        category.name = name || category.name;
        category.description = description || category.description;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).delete(protect, admin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        const productCount = await Product.countDocuments({ category_id: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                message: `Không thể xoá danh mục này vì đang có ${productCount} sản phẩm trực thuộc. Vui lòng xoá hoặc chuyển sản phẩm sang danh mục khác trước.`
            });
        }
        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Đã xoá danh mục thành công' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
