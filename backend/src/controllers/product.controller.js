const Product = require('../models/product.model');

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        stock,
        images,
        category_id,
        brand_id,
        is_visible
    } = req.body;

    try {
        const product = new Product({
            name,
            price,
            description,
            stock,
            images,
            category_id,
            brand_id,
            is_visible: typeof is_visible === 'boolean' ? is_visible : true
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const isAdmin = req.user && req.user.role_id && req.user.role_id.name === 'ADMIN';
        const filter = isAdmin ? {} : { $or: [{ is_visible: true }, { is_visible: { $exists: false } }] };
        const products = await Product.find(filter).populate('category_id', 'name').populate('brand_id', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id', 'name').populate('brand_id', 'name');

        if (!product) {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            return;
        }

        const isAdmin = req.user && req.user.role_id && req.user.role_id.name === 'ADMIN';
        if (product.is_visible === false && !isAdmin) {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        stock,
        images,
        category_id,
        brand_id,
        is_visible
    } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (name !== undefined) product.name = name;
            if (price !== undefined) product.price = price;
            if (description !== undefined) product.description = description;
            if (stock !== undefined) product.stock = stock;
            if (images !== undefined) product.images = images;
            if (category_id !== undefined) product.category_id = category_id;
            if (brand_id !== undefined) product.brand_id = brand_id;
            if (typeof is_visible === 'boolean') product.is_visible = is_visible;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: 'Đã xoá sản phẩm' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
