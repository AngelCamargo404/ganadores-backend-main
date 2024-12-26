const express = require('express');
const {body} = require('express-validator');
const validator = require('../middlewares/validators/runValidations.validator');
const {checkJwt} = require('../middlewares/validators/jwt.validator');
const {
    checkName,
} = require('../helpers/db-validators.helper')
const api = express.Router();
const ticket_controller = require('../controllers/ticket.controller.js');

api.post('/', [], ticket_controller.create);
api.put('/restart-all-tickets', [], ticket_controller.restartTickets);
api.put('/:id', [], ticket_controller.update);

api.get('/', [], ticket_controller.getBy);

module.exports = api;