const express = require('express');

const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');

const Router = express.Router();

Router.get('/', clientController.getAllClients);

Router.use(authController.protect);

Router.post('/send-email', clientController.sendEmailToClients);

Router.route('/users/:userid')
  .get(clientController.getUser)
  .patch(clientController.updateUser);

Router.route('/users')
  .get(clientController.getAllUsers)
  .post(clientController.addUser);

module.exports = Router;
