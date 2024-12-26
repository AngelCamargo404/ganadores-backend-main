const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const brand_schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    imageId: {
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

let brand_model = mongoose.model('brand', brand_schema);
module.exports = {
    brand_model
}