const mongoose = require('mongoose');
const tag_schema = mongoose.Schema({
    name: {
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

let tag_model = mongoose.model('tag', tag_schema);
module.exports = {
    tag_model
}