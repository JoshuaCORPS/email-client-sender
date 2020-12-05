const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: [true, 'Email already exist'],
    required: [true, 'Please provide your email'],
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  password: {
    type: String,
    select: false,
    minlength: [8, 'Password must have atleast 8 characters'],
    required: [true, 'Please provide your password'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (inputPassword) {
        return inputPassword === this.password;
      },
      message: "Password don't match",
    },
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
  active: {
    type: Boolean,
    default: false,
  },
  emailVerifyToken: String,
});

clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

clientSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'users',
    select: '-__v -client',
  });

  next();
});

clientSchema.methods.isPasswordCorrect = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

module.exports = mongoose.model('Client', clientSchema);
