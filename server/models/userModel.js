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
  client: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Client',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
