const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Client = require('../models/clientModel');

const sendEmail = require('../util/email');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const filterObj = require('../util/filterObjBody');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendCookieTokenResponse = (client, statusCode, res, req) => {
  const token = signToken(client._id);

  const cookieOption = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'none',
  };

  res.cookie('jwt', token, cookieOption);

  client.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      client,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  if (req.body.contactNumber && !req.body.contactNumber.startsWith('09'))
    return next(new AppError("Contact number must start with '09...'", 400));

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'contactNumber',
    'address',
    'password',
    'passwordConfirm'
  );

  filteredBody.emailVerifyToken = hashedToken;

  await Client.create(filteredBody);

  const verifyURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/verify/${verifyToken}`;

  const message = `To activate your account, please verify your email address.\nYour account will not be created until your email address is confirmed.\n\nClick this link to activate your account: ${verifyURL}`;

  await sendEmail({
    from: 'Sender account@sender.com',
    email: req.body.email,
    subject: 'Verify Your Account',
    message,
  });

  res.status(201).json({
    status: 'success',
    message:
      'Register successful.\nPlease check your email to verify your account!',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new AppError('Please provide your email and password to proceed', 400)
    );

  const client = await Client.findOne({
    email,
    active: { $ne: false },
  }).select('+password');

  if (!client || !(await client.isPasswordCorrect(password, client.password)))
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password',
    });

  createSendCookieTokenResponse(client, 200, res, req);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'none',
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
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

  req.client = client;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.client.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const client = await Client.findOne({
    emailVerifyToken: hashedToken,
    active: false,
  });

  if (!client) return next(new AppError('Invalid token', 400));

  client.active = true;
  client.emailVerifyToken = undefined;

  await client.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Account successfully activated',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email)
    return next(
      new AppError('Please provide your email to reset your password', 400)
    );

  const client = await Client.findOne({ email, active: { $ne: false } });

  if (!client) return next(new AppError('client not found', 404));

  const resetToken = client.createPasswordResetToken();
  await client.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `Hi ${client.name}.\n\nForgot your password? To reset your password, go to this link: ${resetURL}`;

  try {
    await sendEmail({
      from: 'Sender support@sender.com',
      email,
      subject: 'Your password reset token (valid for only 10 minutes)',
      message,
    });
  } catch (error) {
    client.passwordResetToken = undefined;
    client.passwordResetExpires = undefined;

    await client.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later!',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to mail',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm)
    return next(new AppError('Please provide your password to proceed', 400));

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const client = await Client.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!client)
    return next(new AppError('Token is invalid or has expired', 400));

  client.password = password;
  client.passwordConfirm = passwordConfirm;
  client.passwordResetToken = undefined;
  client.passwordResetExpires = undefined;

  await client.save();

  createSendCookieTokenResponse(client, 200, res, req);
});

exports.verifyResetToken = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const client = await Client.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!client) return next(new AppError('Invalid token', 400));

  res.status(200).json({
    status: 'success',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword || !password || !passwordConfirm)
    return next(new AppError('Please input your credentials!', 400));

  const client = await Client.findById(req.client.id).select('+password');

  if (
    !client ||
    !(await client.isPasswordCorrect(currentPassword, client.password))
  )
    return next(new AppError('Incorrect Current Password!', 400));

  client.password = password;
  client.passwordConfirm = passwordConfirm;
  await client.save();

  createSendCookieTokenResponse(client, 200, res, req);
});

exports.updateInfo = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'contactNumber',
    'address'
  );

  const client = await Client.findByIdAndUpdate(req.client.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!client) return next(new AppError('client not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      client,
    },
  });
});
