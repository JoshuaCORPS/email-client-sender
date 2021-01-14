const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const Client = require('../../../models/clientModel');
const User = require('../../../models/userModel');
const mongoServer = new MongoMemoryServer();

exports.connect = async () => {
  const mongoURI = await mongoServer.getUri();
  await mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

exports.disconnect = async () => {
  await mongoose.disconnect();
};

exports.createClient = async () => {
  await Client.create({
    name: 'dummy sender',
    email: 'dummysender@mailsac.com',
    contactNumber: '09123465789',
    address: 'Marilao Bulacan',
    password: 'testpassword',
    passwordConfirm: 'testpassword',
    active: true,
    billCategories: [
      {
        value: 'Internet',
        slug: 'internet',
      },
      {
        value: 'Electricity',
        slug: 'electricity',
      },
    ],
  });
};

exports.deleteClients = async () => {
  await Client.deleteMany();
};

exports.deleteUsers = async () => {
  await User.deleteMany();
};
