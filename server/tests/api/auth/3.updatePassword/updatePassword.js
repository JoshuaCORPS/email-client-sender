const { expect } = require('chai');
require('dotenv').config();

const { login, updatePassword } = require('../../../util/response');
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
} = require('../../../util/db');

describe('Auth UpdatePassword API Endpoint', () => {
  let token;

  before(async () => {
    await connect();
    await createClient();

    const response = await login({
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    });

    token = response.body.token;
  });

  after(async () => {
    await deleteClients();
    await disconnect();
  });

  it('Ok, it should update the client', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await updatePassword(clientPassword, token);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('client');
  });

  it('Fail, it should NOT update (wrong current password)', async () => {
    const clientPassword = {
      currentPassword: 'wrongcurrentpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await updatePassword(clientPassword, token);
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

    const response = await updatePassword(clientPassword, token);
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

    const response = await updatePassword(clientPassword);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  it('Fail, it should NOT update (no current password)', async () => {
    const clientPassword = {
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await updatePassword(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });

  it('Fail, it should NOT update (no new password)', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await updatePassword(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });

  it('Fail, it should NOT update (must confirm new password)', async () => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
    };

    const response = await updatePassword(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });

  it('Fail, it should NOT update (no data)', async () => {
    const clientPassword = {};

    const response = await updatePassword(clientPassword, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please input your credentials!');
  });
});
