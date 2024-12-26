const moment = require('moment');
const {
    tag_model
} = require('../model/tag.model.js');

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

async function deleteEntityById(id) {
    try {
        const model = await getById(id);
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
            tag_model.countDocuments(terms),
            tag_model.find(terms)
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
        const result = await tag_model.findById(id);
        return result;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    create,
    update,
    deleteEntity,
    deleteEntityById,
    getBy,
    getById,
}