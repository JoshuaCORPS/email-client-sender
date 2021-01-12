const { expect } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const mongoose = require('mongoose');

const Client = require('../../../../models/clientModel');
const app = require('../../../../app');
require('dotenv').config();

const mongoServer = new MongoMemoryServer();
const request = supertest(app);

describe('Auth Login API Endpoint', () => {
  const exec = (data) => {
    return request.post('/api/v1/auth/login').send(data);
  };

  before(async () => {
    const mongoURI = await mongoServer.getUri();
    await mongoose.connect(mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    await Client.create({
      name: 'dummy sender',
      email: 'dummysender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
      active: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('Ok, it should login the client', async () => {
    clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    };

    const response = await exec(clientInfo);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('client');
  });

  it('Fail, it should NOT login (wrong password)', async () => {
    clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'wrongpassword',
    };

    const response = await exec(clientInfo);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Incorrect email or password');
  });

  it('Fail, it should NOT login (no email)', async () => {
    clientInfo = {
      password: 'wrongpassword',
    };

    const response = await exec(clientInfo);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your email and password to proceed'
    );
  });

  it('Fail, it should NOT login (no password)', async () => {
    clientInfo = {
      email: 'dummysender@mailsac.com',
    };

    const response = await exec(clientInfo);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your email and password to proceed'
    );
  });

  it('Fail, it should NOT login (no data)', async () => {
    const clientInfo = {};

    const response = await exec(clientInfo);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your email and password to proceed'
    );
  });
});
