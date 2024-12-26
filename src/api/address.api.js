const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator');
const {checkJwt} = require('../middlewares/validators/jwt.validator');
const {
    checkName,
} = require('../helpers/db-validators.helper')
const api = express.Router();
const address_controller = require('../controllers/address.controller.js');

api.post('/', [
    checkJwt,
    validator
],address_controller.create);

api.put('/:id', [], address_controller.update);

api.get('/', address_controller.getBy);
api.get('/:id', address_controller.getById);
api.delete('/:id', [checkJwt], address_controller.deleteById);

module.exports = api;
