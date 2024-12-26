const jwt = require('jsonwebtoken');
const moment = require("moment");
const {createJwt} = require('../helpers/jwt.helper.js');
const payment_repository = require('../repositories/payment.repository.js');
const ticket_repository = require('../repositories/ticket.repository.js');
const bcryptjs = require('bcryptjs');
const config = require('../config/config.js');
const { payment_model } = require('../model/payment.model.js');
const { ticket_model } = require('../model/ticket.model.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        const new_model = new payment_model();
        new_model.nombre = req?.body?.nombre;
        new_model.telefono = req?.body?.telefono;
        new_model.cedula = req?.body?.cedula;
        new_model.referencia = req?.body?.referencia;
        new_model.createdAt = moment().utc();
        const result = await payment_repository.create(new_model);
        
        let resultTicket = {};
        if (result) {
            const new_ticket = new ticket_model();
            new_ticket.numero = req?.body?.ticket;
            new_ticket.payment = result._id;
            new_ticket.createdAt = moment().utc();

            resultTicket = await ticket_repository.create(new_ticket);
        }
        
        return res.status(200).json({
            data: result,
            ticketData: resultTicket,
            ok: true
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await payment_repository.getBy({
            page,
            pageSize,
            terms: {}
        });
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function getById(req, res) {
    try {
        const result = await payment_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    create,
    getBy,
    getById,
}