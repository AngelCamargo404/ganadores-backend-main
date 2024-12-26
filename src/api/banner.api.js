const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator.js');

const api = express.Router();

const banner_controller = require('../controllers/banner.controller.js');

const { checkName } = require('../helpers/db-validators.helper.js');
const { checkJwt } = require('../middlewares/validators/jwt.validator.js');

const upload = require('../middlewares/storage/image.storage');

api.post('/', [
    upload.single('file'),
    body('name', 'Se necesita el nombre del Banner.').custom(value => checkName(value, true)),
    validator
], banner_controller.create);

api.put('/:id', [
    checkJwt,
], banner_controller.update);

api.get('/', [], banner_controller.getBy);
api.get('/:id', [checkJwt], banner_controller.getById);

api.delete('/:id', [checkJwt], banner_controller.deleteById);

module.exports = api;