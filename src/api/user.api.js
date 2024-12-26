const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator');
const {checkJwt} = require('../middlewares/validators/jwt.validator');
const {
    checkName,
} = require('../helpers/db-validators.helper')
const api = express.Router();
const user_controller = require('../controllers/user.controller.js');

api.post('/', [
    body('name', 'Se necesita el nombre del usuario.').custom(checkName),
    validator
],user_controller.create);

api.post('/login', user_controller.login);
api.post('/token', user_controller.refreshToken);
api.post('/change-password', user_controller.changePassword);
api.post('/forget-password', user_controller.forgotPassword)
api.post('/check-recover-code', user_controller.checkVerificationCode)

api.put('/:id', [], user_controller.update);

api.get('/token', user_controller.getByToken);

api.get('/', user_controller.getBy);
api.get('/:id', user_controller.getById);
api.delete('/:id', [checkJwt], user_controller.deleteById);

module.exports = api;
