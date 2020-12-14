const express = require('express');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.get('/', authController.protect, (req, res) =>
  res.status(200).json({ status: 'success' })
);

module.exports = Router;
