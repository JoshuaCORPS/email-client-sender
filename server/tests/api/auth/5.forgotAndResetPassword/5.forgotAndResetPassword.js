const { expect } = require('chai');
require('dotenv').config();

const { forgotPassword, resetPassword } = require('../../../util/response');
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
} = require('../../../util/db');

describe('Auth ForgotPassword API Endpoint', () => {
  before(async () => {
    await connect();
    await createClient();
  });

  after(async () => {
    await deleteClients();
    await disconnect();
  });

  it('Ok, it should send the token in email client', async () => {
    const clientEmail = {
      email: 'dummysender@mailsac.com',
    };

    const response = await forgotPassword(clientEmail);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('Token sent to your email');
  });

  it('Fail, it should NOT send the token in email client (email not found)', async () => {
    const clientEmail = {
      email: 'email@email.com',
    };

    const response = await forgotPassword(clientEmail);
    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('client not found');
  });

  it('Fail, it should NOT reset password (invalid token)', async () => {
    const clientNewPassword = {
      password: 'newPassword',
      passwordConfirm: 'newPassword',
    };

    const response = await resetPassword(clientNewPassword, 'randomtoken');
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Token is invalid or has expired');
  });
});
