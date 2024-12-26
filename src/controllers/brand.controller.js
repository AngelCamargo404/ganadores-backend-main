const config = require('../config/config.js');

const brand_repository = require('../repositories/brand.repository.js');
const {brand_model} = require('../model/brand.model.js');
const { cloudinaryUploadImage } = require('../services/cloudinary.service.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    if (req.file == null) {
        return res.status(400).json({
            message: "Se necesita una imagen para el banner"
        });
    }

    try {
        const new_model = new brand_model();
        new_model.name = req.body.name;
        new_model.thumbnail = req.body.thumbnail;
        new_model.createdBy = req.body.createdBy;
        new_model.createdAt = new Date();

        if (req.file) {
            const uploadImage = await cloudinaryUploadImage(req.file.path);
            new_model.image = uploadImage.url;
            new_model.imageId = uploadImage.id;
        }

        const result = await brand_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_brand_model = await brand_repository.getById(req.params.id);
        
        const {name, thumbnail} = req.body;
        
        edit_brand_model.name = name || edit_brand_model.name;
        edit_brand_model.thumbnail = thumbnail || edit_brand_model.thumbnail;
        
        const result = await brand_repository.update(new_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await brand_repository.getBy({
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
        const result = await brand_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const brand = await brand_repository.getById(req.params.id);
        if (brand == null) {
            return res.status(404).json({
                message: "Categoria no encontrada"
            });
        }
        const result = await brand_repository.deleteEntity(brand);
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