const Brand = require('../models/brand.model');
const Product = require('../models/product.model');

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
    const { name, logo } = req.body;

    try {
        const brand = new Brand({ name, logo });
        const createdBrand = await brand.save();
        res.status(201).json(createdBrand);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({});
        const counts = await Product.aggregate([
            { $group: { _id: '$brand_id', count: { $sum: 1 } } }
        ]);
        const countByBrandId = new Map(counts.map((c) => [String(c._id), c.count]));
        res.json(brands.map((b) => ({ ...b.toObject(), product_count: countByBrandId.get(String(b._id)) || 0 })));
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
    const { name, logo } = req.body;

    try {
        const brand = await Brand.findById(req.params.id);

        if (brand) {
            brand.name = name || brand.name;
            brand.logo = logo || brand.logo;

            const updatedBrand = await brand.save();
            res.json(updatedBrand);
        } else {
            res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (brand) {
            await Brand.deleteOne({ _id: req.params.id });
            res.json({ message: 'Đã xoá thương hiệu' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
};
