const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const bannerVertical_controller = require('../controllers/bannerVertical.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

const upload = require('../middlewares/storage/image.storage.js');

api.post('/', [
    upload.single('file'),
    body('name', 'Se necesita el nombre del bannerVertical.').custom(value => checkName(value, true)),
    validator
], bannerVertical_controller.create);

api.put('/:id', [
    checkJwt,
], bannerVertical_controller.update);

api.get('/', [], bannerVertical_controller.getBy);
api.get('/:id', [checkJwt], bannerVertical_controller.getById);

api.delete('/:id', [checkJwt], bannerVertical_controller.deleteById);

module.exports = api;