const Client = require('../models/clientModel');
const User = require('../models/userModel');
const sendEmail = require('../util/email');

exports.addUser = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      client: req.client.id,
    });

    user.client = undefined;

    const client = await Client.findById(req.client.id);
    client.users.push(user._id);

    await client.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.sendEmailToClients = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getAllClients = async (req, res) => {
  const clients = await Client.find();

  res.status(200).json({
    status: 'success',
    data: {
      clients,
    },
  });
};
