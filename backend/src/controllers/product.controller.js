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
        brand_id
    } = req.body;

    try {
        const product = new Product({
            name,
            price,
            description,
            stock,
            images,
            category_id,
            brand_id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { featured, limit, sort, keyword, brands, minPrice, maxPrice } = req.query;
        let query = {};

        // Featured filter
        if (featured === 'true') {
            query.is_featured = true;
        }

        // Keyword search (name)
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        // Multiple Brands filter
        if (brands && brands.trim() !== '') {
            const brandList = brands.split(',').filter(id => id.trim() !== '');
            if (brandList.length > 0) {
                query.brand_id = { $in: brandList };
            }
        }

        // Price range filter
        let priceFilter = {};
        if (minPrice) priceFilter.$gte = Number(minPrice);
        if (maxPrice && Number(maxPrice) < 200000000) {
            priceFilter.$lte = Number(maxPrice);
        }
        
        if (Object.keys(priceFilter).length > 0) {
            query.price = priceFilter;
        }

        let productsQuery = Product.find(query)
            .populate('category_id', 'name')
            .populate('brand_id', 'name');

        // Sorting
        if (sort === 'newest') {
            productsQuery = productsQuery.sort({ created_at: -1 });
        } else if (sort === 'price-asc') {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === 'price-desc') {
            productsQuery = productsQuery.sort({ price: -1 });
        } else {
            productsQuery = productsQuery.sort({ name: 1 });
        }

        if (limit) {
            productsQuery = productsQuery.limit(Number(limit));
        }

        const products = await productsQuery;
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id', 'name').populate('brand_id', 'name');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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
        brand_id
    } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.stock = stock || product.stock;
            product.images = images || product.images;
            product.category_id = category_id || product.category_id;
            product.brand_id = brand_id || product.brand_id;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
