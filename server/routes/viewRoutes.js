const express = require('express');
const viewController = require('../controllers/viewController');
const { protect } = require('../controllers/authController');

const Router = express.Router();

Router.get('/', protect, viewController.checkTokenAndSearchClient);

module.exports = Router;
