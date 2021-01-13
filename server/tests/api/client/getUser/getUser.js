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

describe('Client Get User API Endpoint', () => {
  let token;
  let userid;

  const exec = (userid, data, token) => {
    return sendWithCookie(
      request.get,
      `/api/v1/clients/users/${userid}`,
      data,
      token
    );
  };

  const exec2 = (data, token) => {
    return sendWithCookie(request.post, '/api/v1/clients/users', data, token);
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

    const newUser = {
      name: 'Test User',
      email: 'testsenderuser@mailsac.com',
      contactNumber: '09596798461',
      address: 'Marilao Bulacan',
      monthlyBill: 1600,
      billDate: '12/22/2020',
      billCategory: 'Internet',
    };

    const response2 = await exec2(newUser, token);
    userid = response2.body.data.user.id;
  });

  after(async () => {
    await deleteClients();
    await disconnect();
  });

  it('Ok, it should get a user', async () => {
    const response = await exec(userid, '', token);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('user');
  });

  it('Fail, it should NOT get a user (not authenticated)', async () => {
    const response = await exec(userid);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  it('Fail, it should NOT get a user (wrong userid)', async () => {
    const response = await exec('somerandomid', '', token);
    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('user not found');
  });
});
