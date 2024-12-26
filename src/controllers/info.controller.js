const jwt = require('jsonwebtoken');
const moment = require("moment");
const {createJwt} = require('../helpers/jwt.helper.js');
const info_repository = require('../repositories/info.repository.js');
const bcryptjs = require('bcryptjs');
const config = require('../config/config.js');
const { info_model } = require('../model/info.model.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        const new_model = new info_model();
        new_model.text = req?.body?.text;

        const result = await info_repository.create(new_model);

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
        const edit_info_model = await info_repository.getById(req.params.id);
        const { text } = req.body;
        
        edit_info_model.text = text || edit_info_model.text;

        if (req.body.delete) {
            edit_info_model.delete = req.body.delete || edit_info_model.delete
            edit_info_model.deletedAt = moment().utc();
        }

        const result = await info_repository.update(edit_info_model);
        return res.status(200).json(result);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize, estado=""} = req.query;
        const result = await info_repository.getBy({
            page,
            pageSize,
            terms: estado ? {estado} : {}
        });
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function getById(req, res) {
    try {
        const result = await info_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    create,
    getBy,
    getById,
    update,
}