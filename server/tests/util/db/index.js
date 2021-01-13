const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const Client = require('../../../models/clientModel');
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
  });
};

exports.deleteClients = async () => {
  await Client.deleteMany();
};
