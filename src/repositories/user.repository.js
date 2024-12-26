const mongoose = require('mongoose');
const moment = require('moment');
const {
    user_model
} = require('../model/user.model.js');

async function create(model) {
    try {
        const result = await model.save();
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function count(terms) {
    try {
        const result = await user_model.countDocuments(terms);
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
            user_model.countDocuments(terms),
            user_model.find(terms)
                .sort(sort)
                .skip(Number(page))
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
        const result = await user_model.findById(id).exec();
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function getByLogin(email) {
    try {
        const result = await user_model.findOne({
            email: email
        });
        return result;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    create,
    update,
    deleteEntity,
    getBy,
    getById,
    getByLogin,
    count,
}