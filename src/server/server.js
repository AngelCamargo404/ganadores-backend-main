const http = require('http');
const https = require('https');
const cors = require('cors');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const helmet = require('helmet');

const api = require("../api/");

const morgan = require('morgan');

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}));

app.use(bodyParser.json({
  limit: '10mb'
}));

app.use(helmet());

app.use('/api/v1/products', api.product);
app.use('/api/v1/categories', api.category);
app.use('/api/v1/addresses', api.address);
app.use('/api/v1/discounts', api.discount);
app.use('/api/v1/users', api.user);
app.use('/api/v1/brands', api.brand);
app.use('/api/v1/tags', api.tag);
app.use('/api/v1/banners', api.banner);
app.use('/api/v1/banners-vertical', api.bannerVertical);
app.use('/api/v1/orders', api.order);
app.use('/api/v1/tickets', api.ticket);
app.use('/api/v1/payments', api.payment);
app.use('/api/v1/info', api.info);

app.get('*', function (req, res, next) {
  let err = new Error('Pagina no encontrada.');
  err.statusCode = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

const httpServer = http.createServer(app);
module.exports = httpServer;