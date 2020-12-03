const express = require('express');

const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');

const Router = express.Router();

Router.get('/', clientController.getAllClients);
Router.patch('/add-user', authController.protect, clientController.addUser);
Router.post(
  '/send-email',
  authController.protect,
  clientController.sendEmailToClients
);

module.exports = Router;
