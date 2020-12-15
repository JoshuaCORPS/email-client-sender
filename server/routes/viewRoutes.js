const express = require('express');
const viewController = require('../controllers/viewController');

const Router = express.Router();

Router.get('/', viewController.checkTokenAndSearchClient);

module.exports = Router;
