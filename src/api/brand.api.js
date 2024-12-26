const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const brand_controller = require('../controllers/brand.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

const upload = require('../middlewares/storage/image.storage');

api.post('/', [
    upload.single('file'),
    body('name', 'Se necesita el nombre del producto.').custom(value => checkName(value, true)),
    validator
], brand_controller.create);

api.put('/:id', [
    checkJwt,
], brand_controller.update);

api.get('/', [], brand_controller.getBy);
api.get('/:id', [checkJwt], brand_controller.getById);

api.delete('/:id', [checkJwt], brand_controller.deleteById);

module.exports = api;