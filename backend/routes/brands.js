const express = require('express');
const router = express.Router();
const Brand = require('../schemas/brands');
const Product = require('../schemas/products');
const { protect, admin } = require('../utils/auth');

router.route('/').post(protect, admin, async (req, res) => {
    const { name, logo } = req.body;
    try {
        const brand = new Brand({ name, logo });
        const createdBrand = await brand.save();
        res.status(201).json(createdBrand);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).get(async (_req, res) => {
    try {
        const brands = await Brand.find({});
        const counts = await Product.aggregate([
            { $group: { _id: '$brand_id', count: { $sum: 1 } } }
        ]);
        const countByBrandId = new Map(counts.map((c) => [String(c._id), c.count]));
        res.json(brands.map((b) => ({ ...b.toObject(), product_count: countByBrandId.get(String(b._id)) || 0 })));
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).put(protect, admin, async (req, res) => {
    const { name, logo } = req.body;
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
        brand.name = name || brand.name;
        brand.logo = logo || brand.logo;
        const updatedBrand = await brand.save();
        res.json(updatedBrand);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}).delete(protect, admin, async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
        const productCount = await Product.countDocuments({ brand_id: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                message: `Không thể xoá thương hiệu này vì đang có ${productCount} sản phẩm trực thuộc. Vui lòng xoá hoặc chuyển sản phẩm sang thương hiệu khác trước.`
            });
        }
        await Brand.deleteOne({ _id: req.params.id });
        res.json({ message: 'Đã xoá thương hiệu thành công' });
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
