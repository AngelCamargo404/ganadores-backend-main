const mongoose = require('mongoose');
const moment = require('moment');
const {
    payment_model
} = require('../model/payment.model.js');

async function create(model) {
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
            payment_model.countDocuments(terms),
            payment_model.find(terms)
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
        const result = await payment_model.findById(id);
        return result;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    create,
    getBy,
    getById,
}