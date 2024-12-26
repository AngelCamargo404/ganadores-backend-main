const mongoose = require('mongoose');
const moment = require('moment');
const {
    address_model
} = require('../model/address.model.js');

async function create(model) {
    try {
        const result = await model.save();
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function update(model) {
    try {
        const result = await model.save();
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function deleteEntity(model) {
    try {
        model.deleted = true;
        model.deletedAt = moment().utc();
        const result = await model.save();
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function getBy({
    page,
    pageSize,
    terms
}) {
    try {
        terms.deleted = false;
        const [count, result] = await Promise.all([
            address_model.countDocuments(terms),
            address_model.find(terms)
                .skip(Number(page * pageSize))
                .limit(Number(pageSize))
        ]);

        return {
            data: [...result],
            dataLength: count,
            page,
            pageSize,
        };
    } catch (e) {
        console.error(e);
    }
}

async function getById(id) {
    try {
        const result = await address_model.findById(id).exec();
        return result;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    create,
    update,
    deleteEntity,
    getBy,
    getById,
}