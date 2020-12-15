const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Client = require('../models/clientModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.checkTokenAndSearchClient = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('Please login to continue', 401));

  const clientToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const client = await Client.findById(clientToken.id);

  if (!client) return next(new AppError('User no longer exist', 404));

  res.status(200).json({
    status: 'success',
    data: {
      client,
    },
  });
});
