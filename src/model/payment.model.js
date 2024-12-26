const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const payment_schema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true,
    },
    referencia: {
        type: String,
        required: true,
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
    }
});

const payment_model = mongoose.model('payment', payment_schema);

module.exports = {
    payment_model
}