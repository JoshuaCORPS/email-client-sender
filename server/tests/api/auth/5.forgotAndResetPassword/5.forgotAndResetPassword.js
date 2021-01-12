const { expect } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const supertest = require('supertest');
require('dotenv').config();

const app = require('../../../../app');
const Client = require('../../../../models/clientModel');
const request = supertest(app);
const mongoServer = new MongoMemoryServer();

describe('Auth ForgotPassword API Endpoint', () => {
  const exec = (data) => {
    return request.post('/api/v1/auth/forgot-password').send(data);
  };

  const exec2 = (data, token) => {
    return request.post(`/api/v1/auth/reset-password/${token}`).send(data);
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

  it('Ok, it should send the token in email client', async () => {
    const clientEmail = {
      email: 'dummysender@mailsac.com',
    };

    const response = await exec(clientEmail);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('Token sent to your email');
  });

  it('Fail, it should NOT send the token in email client (email not found)', async () => {
    const clientEmail = {
      email: 'email@email.com',
    };

    const response = await exec(clientEmail);
    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('client not found');
  });

  it('Fail, it should NOT reset password (invalid token)', async () => {
    const clientNewPassword = {
      password: 'newPassword',
      passwordConfirm: 'newPassword',
    };

    const response = await exec2(clientNewPassword, 'randomtoken');
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Token is invalid or has expired');
  });
});
