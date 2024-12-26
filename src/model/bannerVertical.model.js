const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const verticalBanner_schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    image: {
        type: String,
        require: true
    },
    imageId: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
});

let bannerVertical_model = mongoose.model('verticalBanner', verticalBanner_schema);
module.exports = {
    bannerVertical_model
}