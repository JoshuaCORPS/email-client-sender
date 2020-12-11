const Client = require('../models/clientModel');
const User = require('../models/userModel');

const filterObj = require('../util/filterObjBody');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

// For All Clients
exports.getAllClients = catchAsync(async (req, res, next) => {
  const clients = await Client.find({
    role: 'client',
    active: { $ne: false },
  }).select('-users');

  res.status(200).json({
    status: 'success',
    results: clients.length,
    data: {
      clients,
    },
  });
});

exports.getClient = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.clientid).select('-users');

  if (!client) return next(new AppError('client not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      client,
    },
  });
});

exports.updateClient = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email');

  const client = await Client.findByIdAndUpdate(
    req.params.clientid,
    filteredBody,
    { new: true, runValidators: true }
  );

  if (!client) return next(new AppError('client not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      client,
    },
  });
});

exports.deleteClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndUpdate(req.params.clientid, {
    active: false,
  });

  if (!client) return next(new AppError('client not found', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// For All Client Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-client');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userid).select('-client');

  if (!user) return next(new AppError('user not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.params.userid, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError('user not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userid);

  if (!user) return next(new AppError('user not found', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
