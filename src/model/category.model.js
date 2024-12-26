const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const category_schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
    }],
    thumbnail: {
        type: String,
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

let category_model = mongoose.model('category', category_schema);
module.exports = {
    category_model
}