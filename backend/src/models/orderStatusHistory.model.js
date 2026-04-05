const mongoose = require('mongoose');

const orderStatusHistorySchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    changed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status_type: {
        type: String,
        enum: ['order', 'payment'],
        required: true
    },
    old_value: {
        type: String,
        required: true
    },
    new_value: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const OrderStatusHistory = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);

module.exports = OrderStatusHistory;
