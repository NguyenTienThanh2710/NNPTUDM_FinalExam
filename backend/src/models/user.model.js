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
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    avatar: {
        type: String
    },
<<<<<<< HEAD
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
=======
>>>>>>> f0b9c95efda617b6cecb9591dbbb748c2481fa54
    status: {
        type: String,
        enum: ['active', 'locked'],
        default: 'active'
    }
});

module.exports = mongoose.model('User', UserSchema);
