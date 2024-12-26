const config = require('../config/config.js');

const tag_repository = require('../repositories/tag.repository.js');
const {tag_model} = require('../model/tag.model.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        const new_model = new tag_model();
        new_model.name = req.body.name;
        new_model.createdAt = new Date();

        const result = await tag_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_tag_model = await tag_repository.getById(req.params.id);
        
        const {name} = req.body;
        
        edit_tag_model.name = name || edit_tag_model.name;
        
        const result = await tag_repository.update(new_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await tag_repository.getBy({
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
        const result = await tag_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const tag = await tag_repository.getById(req.params.id);
        if (tag == null) {
            return res.status(404).json({
                message: "Etiqueta no encontrada"
            });
        }
        const result = await tag_repository.deleteEntity(tag);
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
    deleteById,
}