const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    avatar: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'locked'],
        default: 'active'
    }
});

module.exports = mongoose.model('User', UserSchema);
