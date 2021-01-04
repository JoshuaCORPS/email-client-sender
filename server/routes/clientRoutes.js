const express = require('express');

const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');
const categoryController = require('../controllers/categoryController');

const Router = express.Router();

Router.use(authController.protect);

Router.post('/send-email', clientController.sendEmailToUsers);

Router.route('/users')
  .get(clientController.getAllUsers)
  .post(clientController.addUser);

Router.route('/categories')
  .get(categoryController.getAllCategories)
  .patch(categoryController.addCategory);

Router.route('/users/:userid')
  .get(clientController.getUser)
  .patch(clientController.updateUser)
  .delete(clientController.deleteUser);

Router.route('/categories/:category')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = Router;
