const config = require('../config/config.js');

const banner_repository = require('../repositories/banner.repository.js');
const {banner_model} = require('../model/banner.model.js');
const { cloudinaryUploadImage } = require('../services/cloudinary.service.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        if (req.file == null) {
            return res.status(400).json({
                message: "Se necesita una imagen para el banner"
            });
        }

        const new_model = new banner_model();
        new_model.name = req.body.name;
        new_model.createdBy = req.body.createdBy;
        new_model.createdAt = new Date();

        if (req.file) {
            const uploadImage = await cloudinaryUploadImage(req.file.path);
            new_model.image = uploadImage.url;
            new_model.imageId = uploadImage.id;
        }

        const result = await banner_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_banner_model = await banner_repository.getById(req.params.id);
        
        const {name, isVertical} = req.body;
        
        edit_banner_model.name = name || edit_banner_model.name;
        edit_banner_model.updatedAt = new Date();
        if (isVertical != undefined) {
            edit_banner_model.isVertical = !edit_banner_model.isVertical; 
        }
        
        const result = await banner_repository.update(edit_banner_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await banner_repository.getBy({
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
        const result = await banner_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const banner = await banner_repository.getById(req.params.id);
        if (banner == null) {
            return res.status(404).json({
                message: "Categoria no encontrada"
            });
        }
        const result = await banner_repository.deleteEntity(banner);
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