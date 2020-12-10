const express = require('express');

const authController = require('../controllers/authController');

const Router = express.Router();

Router.post('/register', authController.register);
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);
Router.post('/forgot-password', authController.forgotPassword);
Router.post('/verify/:token', authController.verifyEmail);
Router.post('/reset-password/:token', authController.resetPassword);

module.exports = Router;
