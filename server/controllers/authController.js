const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Client = require('../models/clientModel');

const sendEmail = require('../util/email');
const catchAsync = require('../util/catchAsync');

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

  const client = await Client.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    emailVerifyToken: hashedToken,
  });

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

  createSendCookieTokenResponse(client, 201, res, req);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide your email and password to proceed',
    });

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

  if (!token)
    return res.status(401).json({
      status: 'fail',
      message: 'Please login to continue',
    });

  const clientToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const client = await Client.findById(clientToken.id);

  if (!client)
    return res.status(404).json({
      status: 'fail',
      message: 'User no longer exist',
    });

  req.client = client;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.client.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
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

  if (!client)
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid token',
    });

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
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide your email to reset your password',
    });

  const client = await Client.findOne({ email, active: { $ne: false } });

  if (!client)
    return res.status(404).json({
      status: 'fail',
      message: 'client not found',
    });

  const resetToken = client.createPasswordResetToken();
  await client.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `Hi ${client.name}.\n\nForgot your password? To reset your password, go to this link: ${resetURL}.`;

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

    res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email. Please try again later!',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to mail',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm)
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide your password to proceed',
    });

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const client = await Client.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!client)
    return res.status(400).json({
      status: 'fail',
      message: 'Token is invalid or has expired',
    });

  client.password = password;
  client.passwordConfirm = passwordConfirm;
  client.passwordResetToken = undefined;
  client.passwordResetExpires = undefined;

  await client.save();

  createSendCookieTokenResponse(client, 200, res, req);
});
