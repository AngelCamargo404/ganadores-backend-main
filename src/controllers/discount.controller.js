const config = require('../config/config.js');

const discount_repository = require('../repositories/discount.repository.js');
const {discount_model} = require('../model/discount.model.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        const new_model = new discount_model();
        new_model.name = req.body.name;
        new_model.description = req.body.description;
        new_model.products = req.body.products;
        new_model.discountPercentage = req.body.discountPercentage;
        new_model.startDate = req.body.startDate;
        new_model.endDate = req.body.endDate;
        new_model.createdBy = req.body.createdBy;

        const result = await discount_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_discount_model = await discount_repository.getById(req.params.id);
        
        const {name, description, products, discountPercentage, startDate, endDate} = req.body;

        edit_discount_model.name = name || edit_discount_model.name;
        edit_discount_model.description = description || edit_discount_model.description;
        edit_discount_model.products = products || edit_discount_model.products;
        edit_discount_model.discountPercentage = discountPercentage || edit_discount_model.discountPercentage;
        edit_discount_model.startDate = startDate || edit_discount_model.startDate;
        edit_discount_model.endDate = endDate || edit_discount_model.endDate;
        
        const result = await discount_repository.update(new_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await discount_repository.getBy({
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
        const result = await discount_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const discount = await discount_repository.getById(req.params.id);
        if (discount == null) {
            return res.status(404).json({
                message: "Categoria no encontrada"
            });
        }
        const result = await discount_repository.deleteEntity(discount);
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
    deleteById
}