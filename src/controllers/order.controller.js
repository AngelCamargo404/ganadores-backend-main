const config = require('../config/config.js');

const user_repository = require('../repositories/user.repository.js');
const order_repository = require('../repositories/order.repository.js');
const product_repository = require('../repositories/product.repository.js');
const {order_model} = require('../model/order.model.js');

const defaultPageSize = config.defaultPageSize;

const mongoose = require('mongoose');
const { cloudinaryUploadImage, deleteCloudinaryApi } = require('../services/cloudinary.service.js');

async function create(req, res) {
    try {
        const new_model = new order_model();
        new_model.name = req.body.name;
        new_model.products = req.body.products;
        new_model.total = req.body.total;
        new_model.deliveryMethod = req.body.deliveryMethod;
        new_model.createdBy = req.body.user;
        new_model.createdAt = new Date();
        
        const get_user = await user_repository.getById(new_model.createdBy);

        new_model.address = get_user?.principalAddress || null;

        const ordersByUser = await order_repository.getBy({
            page: 0,
            pageSize: 1,
            terms: {
                createdBy: new_model.createdBy
            },
            sort: {
                createdAt: -1
            }
        });

        new_model.orderNumber = (get_user?.registerNumber || "0") + "-" + (ordersByUser.dataLength + 1);

        const result = await order_repository.create(new_model);

        for(let i = 0; i < new_model.products.length; i++) {
            const product = new_model.products[i];
            const get_product = await product_repository.getById(product.product);
            get_product.stock -= product.quantity;
            await product_repository.update(get_product);
        }
        
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_order_model = await order_repository.getById(req.params.id);
        
        const {name, deliveryMethod, orderNumber, status} = req.body;
        
        edit_order_model.name = name || edit_order_model.name;
        edit_order_model.status = status || edit_order_model.status;
        edit_order_model.orderNumber = orderNumber || edit_order_model.orderNumber;
        edit_order_model.deliveryMethod = deliveryMethod || edit_order_model.deliveryMethod;
        edit_order_model.updatedAt = new Date();
        
        switch(status) {
            case "cancelled":
                for(let i = 0; i < edit_order_model.products.length; i++) {
                    const product = edit_order_model.products[i];
                    const get_product = await product_repository.getById(product.product);
                    get_product.stock += product.quantity;
                    await product_repository.update(get_product);
                }
                
                break;
        }

        const result = await order_repository.update(edit_order_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function updateImagePayment(req, res) {
    try {
        const edit_order_model = await order_repository.getById(req.params.id);

        if (req.file) {
            const resp = await cloudinaryUploadImage(req.file.path);
            
            edit_order_model.paymentImages.push({
                image: resp.url,
                imageId: resp.id
            });
        }
        
        const result = await order_repository.update(edit_order_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function deleteImagePayment(req, res) {
    try {
        const edit_order_model = await order_repository.getById(req.params.id);
        const {imageId} = req.body;

        const index = edit_order_model.paymentImages.findIndex(image => image.imageId === imageId);
        if (index === -1) {
            return res.status(404).json({
                message: "Imagen no encontrada"
            });
        }

        await deleteCloudinaryApi(imageId);
        edit_order_model.paymentImages.splice(index, 1);
        
        const result = await order_repository.update(edit_order_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize, query, createdBy, status} = req.query;
        
        const terms = {};
        if (query) {
            terms["$or"] = [
                {orderNumber: {"$regex": query, "$options": 'i'}},
                {orderNumber: {"$regex": query, "$options": 'i'}},
            ]
        }

        if (createdBy) terms["createdBy"] = createdBy;

        if (status) terms["status"] = status;
        const result = await order_repository.getBy({
            page,
            pageSize,
            terms
        });
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getById(req, res) {
    try {
        const result = await order_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const product = await order_repository.getById(req.params.id);
        if (product == null) {
            return res.status(404).json({
                message: "Orden no encontrada"
            });
        }
        const result = await order_repository.deleteEntity(product);
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
    updateImagePayment,
    deleteImagePayment,
    deleteById
}