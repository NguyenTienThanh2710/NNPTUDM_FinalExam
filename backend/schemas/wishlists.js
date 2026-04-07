const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
