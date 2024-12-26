const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const info_schema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deleteAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
    }
});

const info_model = mongoose.model('info', info_schema);

module.exports = {
    info_model
}