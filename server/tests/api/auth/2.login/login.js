const { expect } = require('chai');
require('dotenv').config();

const { login } = require('../../../util/response');
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
} = require('../../../util/db');

describe('Auth Login API Endpoint', () => {
  before(async () => {
    await connect();
    await createClient();
  });

  after(async () => {
    await deleteClients();
    await disconnect();
  });

  it('Ok, it should login the client', async () => {
    const clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    };

    const response = await login(clientInfo);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('client');
  });

  it('Fail, it should NOT login (wrong password)', async () => {
    const clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'wrongpassword',
    };

    const response = await login(clientInfo);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Incorrect email or password');
  });

  it('Fail, it should NOT login (no email)', async () => {
    const clientInfo = {
      password: 'wrongpassword',
    };

    const response = await login(clientInfo);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your email and password to proceed'
    );
  });

  it('Fail, it should NOT login (no password)', async () => {
    const clientInfo = {
      email: 'dummysender@mailsac.com',
    };

    const response = await login(clientInfo);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your email and password to proceed'
    );
  });

  it('Fail, it should NOT login (no data)', async () => {
    const clientInfo = {};

    const response = await login(clientInfo);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your email and password to proceed'
    );
  });
});
