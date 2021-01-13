const { expect } = require('chai');
const supertest = require('supertest');
require('dotenv').config();

const { send, sendWithCookie } = require('../../../util/response');
const app = require('../../../../app');
const request = supertest(app);
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
} = require('../../../util/db');

describe('Client Send Email API Endpoint', () => {
  let token;

  const exec = (data, token) => {
    return sendWithCookie(
      request.post,
      '/api/v1/clients/send-email',
      data,
      token
    );
  };

  before(async () => {
    await connect();
    await createClient();

    const clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    };

    const response = await send(request.post, '/api/v1/auth/login', clientInfo);
    token = response.body.token;
  });

  after(async () => {
    await deleteClients();
    await disconnect();
  });

  it('Ok, it should send the email', async () => {
    const emailData = {
      subject: 'test subject',
      message: 'test message',
    };

    const response = await exec(emailData, token);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('Email successfully sent!');
  });

  it('Ok, it should NOT send the email (not authenticated)', async () => {
    const emailData = {
      subject: 'test subject',
      message: 'test message',
    };

    const response = await exec(emailData);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  it('FAIL, it should NOT send the email (no subject)', async () => {
    const emailData = {
      message: 'test message',
    };

    const response = await exec(emailData, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide the subject and body to send the email'
    );
  });

  it('Ok, it should NOT send the email (no message)', async () => {
    const emailData = {
      subject: 'test subject',
    };

    const response = await exec(emailData, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide the subject and body to send the email'
    );
  });

  it('Ok, it should NOT send the email (no data)', async () => {
    const emailData = {};

    const response = await exec(emailData, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide the subject and body to send the email'
    );
  });
});
