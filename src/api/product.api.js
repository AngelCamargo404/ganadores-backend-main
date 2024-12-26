const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const product_controller = require('../controllers/product.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

const upload = require('../middlewares/storage/image.storage');

api.post('/', [
    upload.fields(
        [
            {name: 'file', maxCount: 1}, 
            {name: 'images', maxCount: 15}
        ]
    ),
    // body('name', 'Se necesita el nombre del producto.').custom(value => checkName(value, true)),
    validator
], product_controller.create);

api.put('/:id', [
    upload.single('file'),
    checkJwt,
], product_controller.update);

api.put('/:id/add-image', [
    upload.single('file'),
    checkJwt,
], product_controller.updateImage);

api.put('/:id/delete-image', [
    checkJwt,
], product_controller.deleteImage);

api.get('/', [], product_controller.getBy);
api.get('/:id', [], product_controller.getById);

api.delete('/:id', [checkJwt], product_controller.deleteById);

module.exports = api;