const { expect } = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Client = require('../../../../models/clientModel');
const app = require('../../../../app');
require('dotenv').config();

const mongoServer = new MongoMemoryServer();
const request = supertest(app);

describe('Auth UpdatePassword API Endpoint', () => {
  let token;

  const exec = (data, token) => {
    return request
      .patch('/api/v1/auth/update-password')
      .send(data)
      .set('Cookie', `${token ? `jwt=${token}` : ''}`);
  };

  const exec2 = (data) => {
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

    const clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    };

    const response = await exec2(clientInfo);
    token = response.body.token;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('Ok, it should update the client', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.property('client');
  });

  it('Fail, it should NOT update (wrong current password)', async () => {
    const clientPassword = {
      currentPassword: 'wrongcurrentpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Incorrect Current Password!');
  });

  it('Fail, it should NOT update (new password dont match)', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword1',
      passwordConfirm: 'testpassword',
    };

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal("Password don't match");
  });

  it('Fail, it should NOT update (not authenticated)', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await exec(clientPassword);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  it('Fail, it should NOT update (no current password)', async () => {
    const clientPassword = {
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });

  it('Fail, it should NOT update (no new password)', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });

  it('Fail, it should NOT update (must confirm new password)', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
    };

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });

  it('Fail, it should NOT update (no data)', async () => {
    const clientPassword = {};

    const response = await exec(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });
});
