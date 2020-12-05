const express = require('express');

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use(authController.protect, authController.restrictTo('admin'));

Router.get('/clients', adminController.getAllClients);

Router.route('/clients/:clientid')
  .get(adminController.getClient)
  .patch(adminController.updateClient)
  .delete(adminController.deleteClient);

Router.get('/users', adminController.getAllUsers);

Router.route('/users/:userid')
  .get(adminController.getUser)
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser);

module.exports = Router;
