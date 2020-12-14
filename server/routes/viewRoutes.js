const express = require('express');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.get('/', authController.protect);

module.exports = Router;
