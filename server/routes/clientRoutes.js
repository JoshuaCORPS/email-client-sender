const express = require('express');

const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');
const categoryController = require('../controllers/categoryController');
const cacheController = require('../controllers/cacheController');

const Router = express.Router();

Router.use(authController.protect);

Router.post('/send-email', clientController.sendEmailToUsers);

Router.route('/users')
  .get(clientController.getAllUsers)
  .post(cacheController.cleanCache, clientController.addUser);

Router.route('/categories')
  .get(categoryController.getAllCategories)
  .patch(cacheController.cleanCache, categoryController.addCategory);

Router.route('/users/:userid')
  .get(clientController.getUser)
  .patch(cacheController.cleanCache, clientController.updateUser)
  .delete(cacheController.cleanCache, clientController.deleteUser);

Router.route('/categories/:category')
  .patch(cacheController.cleanCache, categoryController.updateCategory)
  .delete(cacheController.cleanCache, categoryController.deleteCategory);

module.exports = Router;
