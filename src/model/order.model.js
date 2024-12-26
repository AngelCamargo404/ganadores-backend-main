const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const order_schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    deliveryMethod: {
        type: String,
        require: true
    },
    orderNumber: {
        type: String,
        require: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'address',
        require: true
    },
    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "processed",
            "cancelled",
        ],
        default: "pending"
    },
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'product'
                },
                quantity: {
                    type: Number
                }
            }
        ],
        require: true
    },
    paymentImages: {
        type: [
            {
                image: { type: String },
                imageId: { type: String }
            }
        ]
    },
    total: {
        type: Number,
        require: true
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

let order_model = mongoose.model('order', order_schema);
module.exports = {
    order_model
}