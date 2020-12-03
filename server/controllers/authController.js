const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Client = require('../models/clientModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const client = await Client.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(client._id);

    client.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        client,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide your email and password to proceed',
      });

    const client = await Client.findOne({ email }).select('+password');

    if (!client || !(await client.isPasswordCorrect(password, client.password)))
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });

    const token = signToken(client._id);

    client.password = undefined;

    console.log(req.headers);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        client,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

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
};
