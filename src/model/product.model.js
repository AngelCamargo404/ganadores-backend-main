const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const product_schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    provider: { 
        type: String,
        default: ""
    },
    brands: {
        type: String,
        default: ""
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
    },
    department: { 
        type: String,
        default: ""
    },
    code: { 
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: Number, 
        required: true 
    },
    specialPrice: { 
        type: Number,
        default: 0
    },
    offerPrice: { 
        type: Number,
        default: 0 
    },
    cost: { 
        type: Number, 
        default: 0
    },
    boxStop: { 
        type:Number,
        default: 0 
    },
    wholesaleStop: { 
        type: Number,
        default: 0 
    },
    invMin: { 
        type: Number,
        default: 0 
    },
    invMax: {
        type: Number,
        default: 0
    },
    weightInMg: {
        type: Number,
        default: 0
    },
    lengthInMm: {
        type: Number,
        default: 0
    },
    widthInMm: {
        type: Number,
        default: 0
    },
    heightInMm: { type: Number },
    tags: { type: String },
    description: { type: String },
    details: { type: String },
    thumbnail: { type: String },
    soldOut: { type: Boolean, default: false },
    images: {
        type: [
            {
                image: { type: String },
                imageId: { type: String }
            }
        ]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    otherCategory: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    stock: { type: Number },
    new: { type: Boolean, default: false },
    offer: { type: Boolean, default: false },
    thumbnailId: {
        type: String,
    },
    otherCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
    }],
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

let product_model = mongoose.model('product', product_schema);
module.exports = {
    product_model
}