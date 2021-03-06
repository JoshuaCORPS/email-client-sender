const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your user name'],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'Please provide your user email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contactNumber: {
      type: String,
      minlength: [11, 'Contact number must only have 11 digits'],
      maxlength: [11, 'Contact number must only have 11 digits'],
      required: [true, 'Please provide your user contact number'],
      validate: {
        validator: function (inputNumber) {
          return inputNumber.startsWith('09');
        },
        message: "Contact number must start with '09...'",
      },
    },
    address: {
      type: String,
      required: [true, 'Please provide your user address'],
    },
    monthlyBill: {
      type: Number,
      min: [1, 'Monthly bill should be at least greater than or equal to 1'],
      required: [true, 'Please provide your user monthly bill'],
    },
    billDate: {
      type: Date,
      required: [true, 'Please provide your user bill date'],
    },
    balance: {
      type: Number,
      min: [0, 'Balance must be greater than or equal to 0'],
      default: 0,
    },
    billCategory: {
      type: String,
      required: [
        true,
        'Please provide a category for the billing of this user',
      ],
    },
    client: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
      },
    ],
    billSentDate: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('paid').get(function () {
  return this.balance === 0;
});

module.exports = mongoose.model('User', userSchema);
