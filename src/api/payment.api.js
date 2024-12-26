const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');
const {checkJwt} = require('../middlewares/validators/jwt.validator.js');
const {
    checkName,
} = require('../helpers/db-validators.helper.js')
const api = express.Router();
const payment_controller = require('../controllers/payment.controller.js');

api.post('/', [], payment_controller.create);

api.get('/', [], payment_controller.getBy);
api.get('/:id', [], payment_controller.getById);

module.exports = api;