const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const banner_schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    isVertical: {
        type: Boolean,
        default: false
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

let banner_model = mongoose.model('banner', banner_schema);
module.exports = {
    banner_model
}