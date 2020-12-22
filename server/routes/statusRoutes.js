const express = require('express');
const statusController = require('../controllers/statusController');

const Router = express.Router();

Router.get('/', statusController.status);

module.exports = Router;
