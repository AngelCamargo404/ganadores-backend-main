const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const category_controller = require('../controllers/category.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

api.post('/', [
    body('name', 'Se necesita el nombre del producto.').custom(value => checkName(value, true)),
    validator
], category_controller.create);

api.put('/:id', [
    checkJwt,
], category_controller.update);

api.put('/:id/add-subcategory', [
    checkJwt,
], category_controller.addSubCategory);

api.get('/', [], category_controller.getBy);
api.get('/:id', [], category_controller.getById);

api.delete('/:id', [checkJwt], category_controller.deleteById);

module.exports = api;