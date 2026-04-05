const Category = require('../models/category.model');
const Product = require('../models/product.model');

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = new Category({ name, description });
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        const counts = await Product.aggregate([
            { $group: { _id: '$category_id', count: { $sum: 1 } } }
        ]);
        const countByCategoryId = new Map(counts.map((c) => [String(c._id), c.count]));
        res.json(categories.map((c) => ({ ...c.toObject(), product_count: countByCategoryId.get(String(c._id)) || 0 })));
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;
            category.description = description || category.description;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Integrity constraint: Check for associated products
        const productCount = await Product.countDocuments({ category_id: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({ 
                message: `Không thể xoá danh mục này vì đang có ${productCount} sản phẩm trực thuộc. Vui lòng xoá hoặc chuyển sản phẩm sang danh mục khác trước.` 
            });
        }

        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Đã xoá danh mục thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
