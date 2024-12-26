const jwt = require('jsonwebtoken');
const moment = require("moment");
const {createJwt} = require('../helpers/jwt.helper.js');
const ticket_repository = require('../repositories/ticket.repository.js');
const bcryptjs = require('bcryptjs');
const config = require('../config/config.js');
const { ticket_model } = require('../model/ticket.model.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        const new_model = new ticket_model();
        new_model.numero = req?.body?.numero;

        const result = await ticket_repository.create(new_model);

        return res.status(200).json({
            data: result,
            ok: true
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_ticket_model = await ticket_repository.getById(req.params.id);
        const { estado, numero } = req.body;
        
        edit_ticket_model.estado = estado || edit_ticket_model.estado;
        edit_ticket_model.numero = numero || edit_ticket_model.numero;

        if (req.body.delete) {
            edit_ticket_model.delete = req.body.delete || edit_ticket_model.delete
            edit_ticket_model.deletedAt = moment().utc();
        }

        const result = await ticket_repository.update(edit_ticket_model);
        return res.status(200).json(result);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function restartTickets(req, res) {
    try {
        const tickets = await ticket_model.updateMany({
            delete: false,
        }, {
            delete: true,
            deletedAt: moment().utc()
        }).exec();

        return res.status(200).json({ok: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize, estado=""} = req.query;
        const result = await ticket_repository.getBy({
            page,
            pageSize,
            terms: estado ? {estado} : {}
        });
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    create,
    getBy,
    update,
    restartTickets,
}