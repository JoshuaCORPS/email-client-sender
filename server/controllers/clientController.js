const Client = require('../models/clientModel');
const User = require('../models/userModel');

const sendEmail = require('../util/email');
const filterObj = require('../util/filterObjBody');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.addUser = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.client.id);

  if (
    client.users.some(
      (user) =>
        user.email === req.body.email &&
        user.billCategory === req.body.billCategory
    )
  )
    return next(
      new AppError('This user already exist in this billing category!', 400)
    );

  if (req.body.contactNumber && !req.body.contactNumber.startsWith('09'))
    return next(new AppError("Contact number must start with '09...'", 400));

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'contactNumber',
    'address',
    'monthlyBill',
    'billDate',
    'billCategory'
  );

  if (
    Object.keys(filteredBody).length !== 0 &&
    req.body.billCategory &&
    !client.billCategories.some(
      (category) => req.body.billCategory === category.value
    )
  )
    return next(new AppError('Category not found', 404));

  if (req.body.balance) filteredBody.balance = req.body.balance;

  const user = await User.create(filteredBody);
  user.client.push(client._id);
  await user.save();

  user.client = undefined;

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
    return next(
      new AppError('Please provide the subject and body to send the email', 400)
    );

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
    return next(new AppError('user not found', 404));

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

  if (index === -1) return next(new AppError('user not found', 404));

  if (req.body.contactNumber && !req.body.contactNumber.startsWith('09'))
    return next(new AppError("Contact number must start with '09...'", 400));

  if (
    req.body.billCategory &&
    !client.billCategories.some(
      (category) => req.body.billCategory === category.value
    )
  )
    return next(new AppError('Category not found', 404));

  if (client.users[index].billCategory !== req.body.billCategory)
    if (
      client.users.some(
        (user) =>
          user.email === req.body.email &&
          user.billCategory === req.body.billCategory
      )
    )
      return next(
        new AppError('This user already exist in this billing category!', 400)
      );

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'contactNumber',
    'address',
    'monthlyBill',
    'billDate',
    'balance',
    'billCategory'
  );

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

  if (index === -1) return next(new AppError('user not found', 404));

  client.users.splice(index, 1);

  await client.save({ validateBeforeSave: false });

  await User.findByIdAndDelete(req.params.userid);

  res.status(204).json({
    message: 'success',
    data: null,
  });
});
