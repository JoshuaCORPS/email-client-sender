const express = require('express');

const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');

const Router = express.Router();

Router.use(authController.protect);

Router.post('/send-email', clientController.sendEmailToUsers);

Router.route('/users')
  .get(clientController.getAllUsers)
  .post(clientController.addUser);

Router.route('/users/:userid')
  .get(clientController.getUser)
  .patch(clientController.updateUser)
  .delete(clientController.deleteUser);

module.exports = Router;
