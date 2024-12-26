const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');
const {checkJwt} = require('../middlewares/validators/jwt.validator.js');
const {
    checkName,
} = require('../helpers/db-validators.helper.js')
const api = express.Router();
const info_controller = require('../controllers/info.controller.js');

api.post('/', [], info_controller.create);
api.put('/:id', [], info_controller.update);

api.get('/:id', [], info_controller.getById);
api.get('/', [], info_controller.getBy);

module.exports = api;