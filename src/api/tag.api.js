const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const tag_controller = require('../controllers/tag.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

api.post('/', [
    body('name', 'Se necesita el nombre de la etiqueta.').custom(value => checkName(value, true)),
    validator
], tag_controller.create);

api.put('/:id', [
    checkJwt,
], tag_controller.update);

api.get('/', [checkJwt], tag_controller.getBy);
api.get('/:id', [checkJwt], tag_controller.getById);

api.delete('/:id', [checkJwt], tag_controller.deleteById);

module.exports = api;