const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
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
  },
  address: {
    type: String,
    required: [true, 'Please provide your user address'],
  },
  client: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Client',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
