const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const discount_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'product',
            }
        ],
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
});

let discount_model = mongoose.model('discount', discount_schema);
module.exports = {
    discount_model
}