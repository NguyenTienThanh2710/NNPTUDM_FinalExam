const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    avatar: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    is_vip: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'locked'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
