const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    images: [
        {
            type: String
        }
    ],
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    is_visible: {
        type: Boolean,
        default: true
    },
    avg_rating: {
        type: Number,
        default: 0
    },
    num_reviews: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', ProductSchema);
