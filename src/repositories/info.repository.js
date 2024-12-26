const mongoose = require('mongoose');
const moment = require('moment');
const {
    info_model
} = require('../model/info.model.js');

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


async function getBy({
    page,
    pageSize,
    terms,
}) {
    try {
        terms.delete = false; 
        
        const [count, result] = await Promise.all([
            info_model.countDocuments(terms),
            info_model.find(terms)
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
        const result = await info_model.findById(id);
        return result;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    create,
    update,
    getBy,
    getById,
}