const config = require('../config/config.js');

const category_repository = require('../repositories/category.repository.js');
const {category_model} = require('../model/category.model.js');

const defaultPageSize = config.defaultPageSize;

async function create(req, res) {
    try {
        const new_model = new category_model();
        new_model.name = req.body.name;
        new_model.description = req.body.description;
        new_model.parentCategory = req.body.category;
        new_model.thumbnail = req.body.thumbnail;
        new_model.createdBy = req.body.createdBy;
        new_model.createdAt = new Date();
        new_model.slug = req.body.slug;

        const result = await category_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_category_model = await category_repository.getById(req.params.id);
        
        const {name, description, category, thumbnail, slug} = req.body;
        
        edit_category_model.name = name || edit_category_model.name;
        edit_category_model.description = description || edit_category_model.description;
        edit_category_model.thumbnail = thumbnail || edit_category_model.thumbnail;
        edit_category_model.parentCategory = category || edit_category_model.parentCategory;
        edit_category_model.slug = slug || edit_category_model.slug;
        
        const result = await category_repository.update(edit_category_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function addSubCategory(req, res) {
    try {
        const edit_category_model = await category_repository.getById(req.params.id);
        
        const {name, description} = req.body;
        
        if  (!edit_category_model) return res.status(404).json({message: "Categoria no encontrada"});

        const new_model = new category_model();
        new_model.name = name;
        new_model.description = description;
        new_model.parentCategory = edit_category_model?._id;
        new_model.thumbnail = req.body.thumbnail;
        new_model.createdBy = req.body.createdBy;
        new_model.createdAt = new Date();
        const resultSubCategory = await category_repository.create(new_model);
        
        edit_category_model.subCategories.push(resultSubCategory._id);

        const result = await category_repository.update(edit_category_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize} = req.query;
        const result = await category_repository.getBy({
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
        const result = await category_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const category = await category_repository.getById(req.params.id);
        if (category == null) {
            return res.status(404).json({
                message: "Categoria no encontrada"
            });
        }
        const result = await category_repository.deleteEntity(category);
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
    addSubCategory,
    deleteById
}