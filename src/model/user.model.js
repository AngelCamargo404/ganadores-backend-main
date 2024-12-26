const mongoose = require('mongoose');
const config = require('../config/config');
const Schema = mongoose.Schema;
const user_schema = mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    lastName: {
        type: String,
        default: '',
        required: true
    },
    fullName: {
        type: String,
        default: '',
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: true,
        emun: [
            'ADMIN_ROLE',
            'USER_ROLE',
        ]
    },
    address: {
        type: String,
        default: '',
    },
    savedAddress: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'address'
        }],
        default: []
    },
    principalAddress: {
        type: Schema.Types.ObjectId,
        ref: 'address',
        default: null
    },
    registerNumber: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: 'Mexico',
    },
    province: {
        type: String,
        default: '',
    },
    postalCode: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    dni: {
        type: String,
        default: ""
    },
    rfc: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: '',
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    birthDate: {
        type: Date,
        default: null
    },
    recoverCode: {
        type: String,
        default: ""
    },
    wallet: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    privacyPolicies: {
        type: Boolean,
        default: false
    },
    whatsappNotification: {
        type: Boolean,
        default: true
    },
    emailNotification: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date
    }
});

user_schema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user; 
}

const user_model = mongoose.model('user', user_schema);

module.exports = {
    user_model
}