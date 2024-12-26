const config = require('../config/config.js');

const bannerVertical_repository = require('../repositories/bannerVertical.repository.js');
const {bannerVertical_model} = require('../model/bannerVertical.model.js');
const { cloudinaryUploadImage } = require('../services/cloudinary.service.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        if (req.file == null) {
            return res.status(400).json({
                message: "Se necesita una imagen para el bannerVertical"
            });
        }

        const new_model = new bannerVertical_model();
        new_model.name = req.body.name;
        new_model.createdBy = req.body.createdBy;
        new_model.createdAt = new Date();

        if (req.file) {
            const uploadImage = await cloudinaryUploadImage(req.file.path);
            new_model.image = uploadImage.url;
            new_model.imageId = uploadImage.id;
        }

        const result = await bannerVertical_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_bannerVertical_model = await bannerVertical_repository.getById(req.params.id);
        
        const {name} = req.body;
        
        edit_bannerVertical_model.name = name || edit_bannerVertical_model.name;
        
        const result = await bannerVertical_repository.update(new_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await bannerVertical_repository.getBy({
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
        const result = await bannerVertical_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const bannerVertical = await bannerVertical_repository.getById(req.params.id);
        if (bannerVertical == null) {
            return res.status(404).json({
                message: "Categoria no encontrada"
            });
        }
        const result = await bannerVertical_repository.deleteEntity(bannerVertical);
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