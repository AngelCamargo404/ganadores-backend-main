const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ticket_schema = mongoose.Schema({
    numero: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobado', 'rechazado'],
        default: 'pendiente'
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deleteAt: {
        type: Date,
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'payment',
        default: null
    },
    createdAt: {
        type: Date,
    }
});

const ticket_model = mongoose.model('ticket', ticket_schema);

module.exports = {
    ticket_model
}