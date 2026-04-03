const Brand = require('../models/brand.model');

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
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (brand) {
<<<<<<< HEAD
            await Brand.findByIdAndDelete(req.params.id);
=======
            await brand.remove();
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
            res.json({ message: 'Brand removed' });
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
};
