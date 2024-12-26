const mongoose = require('mongoose');
const config = require('../config/config');
const Schema = mongoose.Schema;
const address_schema = mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    clientFullName: {
        type: String,
        default: '',
        required: true
    },
    street: {
        type: String,
        default: ""
    },
    colony: {
        type: String,
        default: ""
    },
    externalNumber: {
        type: String,
        default: ""
    },
    internalNumber: {
        type: String,
        default: ""
    },
    reference: {
        type: String,
        default: ""
    },
    rfc: {
        type: String,
        default: ""
    },
    deliveryMethod: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
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
    phone: {
        type: String,
        default: ""
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date
    }
});

const address_model = mongoose.model('address', address_schema);

module.exports = {
    address_model
}