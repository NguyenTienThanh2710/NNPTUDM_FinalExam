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
<<<<<<< HEAD
    },
    is_featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
=======
    }
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
});

module.exports = mongoose.model('Product', ProductSchema);
