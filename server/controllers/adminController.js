const Client = require('../models/clientModel');
const User = require('../models/userModel');
const filterObj = require('../util/filterObjBody');

// For All Clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ role: 'client' }).select('-users');

    res.status(200).json({
      status: 'success',
      results: clients.length,
      data: {
        clients,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientid).select('-users');

    if (!client)
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });

    res.status(200).json({
      status: 'success',
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

exports.updateClient = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, 'name', 'email');

    const client = await Client.findByIdAndUpdate(
      req.params.clientid,
      filteredBody,
      { new: true, runValidators: true }
    );

    if (!client)
      return res.status(404).json({
        status: 'fail',
        message: 'client not found',
      });

    res.status(200).json({
      status: 'success',
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

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.clientid, {
      active: false,
    });

    if (!client)
      return res.status(404).json({
        status: 'fail',
        message: 'client not found',
      });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// For All Client Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-client');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userid).select('-client');

    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });

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

exports.updateUser = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(req.params.userid, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });

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

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userid);

    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
