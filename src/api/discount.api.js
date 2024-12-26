const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const discount_controller = require('../controllers/discount.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

api.post('/', [
    body('name', 'Se necesita el nombre del descuento.').custom(value => checkName(value, true)),
    validator
], discount_controller.create);

api.put('/:id', [
    checkJwt,
], discount_controller.update);

api.get('/', [checkJwt], discount_controller.getBy);
api.get('/:id', [checkJwt], discount_controller.getById);

api.delete('/:id', [checkJwt], discount_controller.deleteById);

module.exports = api;