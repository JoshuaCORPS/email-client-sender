const Client = require('../models/clientModel');
const User = require('../models/userModel');

const sendEmail = require('../util/email');
const filterObj = require('../util/filterObjBody');
const catchAsync = require('../util/catchAsync');

exports.addUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    client: req.client.id,
  });

  user.client = undefined;

  const client = await Client.findById(req.client.id);
  client.users.push(user._id);

  await client.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.sendEmailToUsers = catchAsync(async (req, res, next) => {
  const { subject, message } = req.body;

  if (!subject || !message)
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide the subject and body to send the email.',
    });

  const clients = await Client.findById(req.client.id);

  for (let client of clients.users) {
    await sendEmail({
      from: `${req.client.name} ${req.client.email}`,
      email: client.email,
      subject,
      message,
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Email successfully sent!',
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const clients = await Client.findById(req.client.id);

  res.status(200).json({
    status: 'success',
    results: clients.users.length,
    data: {
      users: clients.users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  if (!client.users.some((user) => user.id === req.params.userid))
    return res.status(404).json({
      status: 'fail',
      message: 'user not found',
    });

  const user = await User.findById(req.params.userid);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  const index = client.users.findIndex((user) => user.id === req.params.userid);

  if (index === -1)
    return res.status(404).json({
      status: 'fail',
      message: 'user not found',
    });

  const filteredBody = filterObj(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.params.userid, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  const index = client.users.findIndex((user) => user.id === req.params.userid);

  if (index === -1)
    return res.status(404).json({
      status: 'fail',
      message: 'user not found',
    });

  client.users.splice(index, 1);

  await client.save({ validateBeforeSave: false });

  res.status(204).json({
    message: 'success',
    data: null,
  });
});
