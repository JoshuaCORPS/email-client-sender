const { expect } = require('chai');
require('dotenv').config();

const { login, addUser } = require('../../../util/response');
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
} = require('../../../util/db');

describe('Client Add User API Endpoint', () => {
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

  it('Ok, it should create new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@mailsac.com',
      contactNumber: '09596798461',
      address: 'Marilao Bulacan',
      monthlyBill: 1600,
      billDate: '12/22/2020',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('user');
  });

  it('Fail, it should NOT create new user (user already exist in category)', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@mailsac.com',
      contactNumber: '09596798461',
      address: 'Marilao Bulacan',
      monthlyBill: 1600,
      billDate: '12/22/2020',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'This user already exist in this billing category!'
    );
  });

  it('Fail, it should NOT create new user (not authenticated)', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@mailsac.com',
      contactNumber: '09596798461',
      address: 'Marilao Bulacan',
      monthlyBill: 1600,
      billDate: '12/22/2020',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  it('Fail, it should NOT create new user (no name)', async () => {
    const newUser = {
      email: 'anotheruser@mailsac.com',
      contactNumber: '09123456789',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your user name');
  });

  it('Fail, it should NOT create new user (no email)', async () => {
    const newUser = {
      name: 'Another User',
      contactNumber: '09123456789',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your user email');
  });

  it('Fail, it should NOT create new user (wrong email format)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'email@email',
      contactNumber: '09123456789',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide a valid email');
  });

  it('Fail, it should NOT create new user (no contactNumber)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your user contact number'
    );
  });

  it('Fail, it should NOT create new user (wrong contactNumber format)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '12345678912',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      "Contact number must start with '09...'"
    );
  });

  it('Fail, it should NOT create new user (contactNumber length < 11)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '091234567',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT create new user (contactNumber length > 11)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '091234567897',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT create new user (no address)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '09123456789',
      monthlyBill: 2000,
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your user address');
  });

  it('Fail, it should NOT create new user (no monthlyBill)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '09123456789',
      address: 'Bocaue Bulacan',
      billDate: '01/11/2021',
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your user monthly bill'
    );
  });

  it('Fail, it should NOT create new user (no billDate)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '09123456789',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billCategory: 'Internet',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your user bill date'
    );
  });

  it('Fail, it should NOT create new user (no billCategory)', async () => {
    const newUser = {
      name: 'Another User',
      email: 'anotheruser@mailsac.com',
      contactNumber: '09123456789',
      address: 'Bocaue Bulacan',
      monthlyBill: 2000,
      billDate: '01/11/2021',
    };

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide a category for the billing of this user'
    );
  });

  it('Fail, it should NOT create new user (no data)', async () => {
    const newUser = {};

    const response = await addUser(newUser, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide a category for the billing of this user.\nPlease provide your user bill date.\nPlease provide your user monthly bill.\nPlease provide your user address.\nPlease provide your user contact number.\nPlease provide your user email.\nPlease provide your user name'
    );
  });
});
