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
  contactNumber: {
    type: String,
    minlength: [11, 'Contact number must only have 11 digits'],
    maxlength: [11, 'Contact number must only have 11 digits'],
    required: [true, 'Please provide your contact number'],
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
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
  photo: {
    type: String,
    default: 'default.jpg',
  },
  emailVerifyToken: String,
  passwordResetToken: String,
  passwordResetExpires: String,
  passwordChangedAt: Date,
});

clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

clientSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

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

clientSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Client', clientSchema);
