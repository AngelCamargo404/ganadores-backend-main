const jwt = require('jsonwebtoken');
const moment = require("moment");
const {createJwt} = require('../helpers/jwt.helper.js');
const address_repository = require('../repositories/address.repository.js');
const {address_model} = require('../model/address.model.js');
const bcryptjs = require('bcryptjs');
const config = require('../config/config.js');

async function create(req, res) {
    try {
        const new_model = new address_model();
        new_model.name = "Direccion de " + req.body.clientFullName;
        new_model.clientFullName = req.body.clientFullName;
        new_model.street = req.body.street;
        new_model.colony = req.body.colony;
        new_model.externalNumber = req.body.externalNumber;
        new_model.internalNumber = req.body.internalNumber;
        new_model.reference = req.body.reference;
        new_model.rfc = req.body.rfc;
        new_model.deliveryMethod = req.body.deliveryMethod;
        new_model.address = req.body.address;
        new_model.country = req.body.country;
        new_model.province = req.body.province;
        new_model.postalCode = req.body.postalCode;
        new_model.city = req.body.city;
        new_model.phone = req.body.phone;
        new_model.createdAt = new Date();
        new_model.user = req.body.user;
    
        const result = await address_repository.create(new_model);

        return res.status(200).json({
            data: result,
            ok: true
        });
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_address_model = await address_repository.getById(req.params.id);

        if (edit_address_model == null) {
            return res.status(404).json({
                message: "Direccion no encontrada"
            });
        }

        edit_address_model.name = req.body.name;
        edit_address_model.clientFullName = req.body.clientFullName;
        edit_address_model.street = req.body.street;
        edit_address_model.colony = req.body.colony;
        edit_address_model.externalNumber = req.body.externalNumber;
        edit_address_model.internalNumber = req.body.internalNumber;
        edit_address_model.reference = req.body.reference;
        edit_address_model.rfc = req.body.rfc;
        edit_address_model.deliveryMethod = req.body.deliveryMethod;
        edit_address_model.address = req.body.address;
        edit_address_model.country = req.body.country;
        edit_address_model.province = req.body.province;
        edit_address_model.postalCode = req.body.postalCode;
        edit_address_model.city = req.body.city;
        edit_address_model.phone = req.body.phone;

        const result = await address_repository.update(edit_address_model);

        return res.status(200).json({data: result});
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page, pageSize, userId: user} = req.query;
        
        const terms = {};

        const result = await address_repository.getBy({
            page,
            pageSize,
            terms
        });

       
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getById(req, res) {
    try {
        const result = await address_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const address = await address_repository.getById(req.params.id);
        if (address == null) {
            return res.status(404).json({
                message: "Direccion no encontrado"
            });
        }
        const result = await address_repository.deleteEntity(address);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    create,
    getBy,
    getById,
    deleteById,
    update,
}