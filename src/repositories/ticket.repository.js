const mongoose = require('mongoose');
const moment = require('moment');
const {
    ticket_model
} = require('../model/ticket.model.js');

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
            ticket_model.countDocuments(terms),
            ticket_model.find(terms)
            .skip(Number(page * pageSize))
            .limit(Number(pageSize))
        ]);

        const soldCount = await ticket_model.countDocuments({ ...terms, payment: { $exists: true } });

        return {
            data: [...result],
            soldCount,
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
        const result = await ticket_model.findById(id);
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