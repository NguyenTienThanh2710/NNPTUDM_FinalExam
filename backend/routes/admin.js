const express = require('express');
const router = express.Router();
const Wishlist = require('../schemas/wishlists');
const { protect, admin } = require('../utils/auth');

router.get('/stats/wishlist', protect, admin, async (_req, res) => {
    try {
        const stats = await Wishlist.aggregate([
            { $group: { _id: '$product_id', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 0,
                    product_id: '$_id',
                    count: 1,
                    name: '$product.name',
                    images: '$product.images',
                    price: '$product.price'
                }
            }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (_error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
