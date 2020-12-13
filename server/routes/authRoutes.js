const express = require('express');

const authController = require('../controllers/authController');

const Router = express.Router();

Router.post('/register', authController.register);
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);
Router.post('/forgot-password', authController.forgotPassword);
Router.post('/verify/:token', authController.verifyEmail);
Router.route('/reset-password/:token')
  .get(authController.verifyResetToken)
  .post(authController.resetPassword);

module.exports = Router;
