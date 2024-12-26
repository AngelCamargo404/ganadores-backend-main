const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const order_controller = require('../controllers/order.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

const upload = require('../middlewares/storage/image.storage');

api.post('/', [
    checkJwt,
    body('name', 'Se necesita el nombre de la orden.').custom(value => checkName(value, true)),
    validator
], order_controller.create);

api.put('/:id', [
    checkJwt,
], order_controller.update);

api.put('/:id/add-image-payment', [
    upload.single('file'),
    checkJwt,
], order_controller.updateImagePayment);

api.put('/:id/delete-image-payment', [
    checkJwt,
], order_controller.deleteImagePayment);

api.get('/', [checkJwt], order_controller.getBy);
api.get('/:id', [checkJwt], order_controller.getById);

api.delete('/:id', [checkJwt], order_controller.deleteById);

module.exports = api;