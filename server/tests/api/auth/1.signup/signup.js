const { expect } = require('chai');
require('dotenv').config();

const { register } = require('../../../util/response');
const { connect, disconnect, deleteClients } = require('../../../util/db');

describe('Auth Register API Endpoint', () => {
  before(async () => {
    await connect();
  });

  after(async () => {
    await deleteClients();
    await disconnect();
  });

  it('Ok, it should create a new client', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body).to.have.property('message');
  });

  it('Fail, it should NOT create a new client (duplicate)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Email already exist.');
  });

  it('Fail, It should NOT create a new client (no name)', async () => {
    const newClient = {
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your name');
  });

  it('Fail, it should NOT create a new client (no email)', async () => {
    const newClient = {
      name: 'test sender',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your email');
  });

  it('Fail, it should NOT create a new client (invalid email format)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'invalid@email',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide a valid email.');
  });

  it('Fail, it should NOT create a new client (no contactNumber)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your contact number'
    );
  });

  it('Fail, it should NOT create a new client (contactNumber must start with 09...)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '12345678901',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      "Contact number must start with '09...'"
    );
  });

  it('Fail, it should NOT create a new client (contactNumber must only have 11 digits)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '0932165498',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT create a new client (contactNumber must only have 11 digits)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '093216549843',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT create a new client (no address)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your address');
  });

  it('Fail, it should NOT create a new client (no password)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      passwordConfirm: 'testpassword',
    };

    const response = await register(newClient);
    expect(response.status).to.eq(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      "Please provide your password.\nPassword don't match"
    );
  });

  it('Fail, it should NOT create a new client (password must have atleast 8 char)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: '1234567',
      passwordConfirm: '1234567',
    };

    const response = await register(newClient);
    expect(response.status).to.eq(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Password must have atleast 8 characters'
    );
  });

  it('Fail, it should NOT create a new client (must confirm password)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: '12345678',
    };

    const response = await register(newClient);
    expect(response.status).to.eq(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please confirm your password');
  });

  it("Fail, it should NOT create a new client (password don't match)", async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: '12345678',
      passwordConfirm: '123456789',
    };

    const response = await register(newClient);
    expect(response.status).to.eq(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal("Password don't match");
  });

  it('Fail, it should NOT create a new client (no password and passwordConfirm)', async () => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
    };

    const response = await register(newClient);
    expect(response.status).to.eq(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please confirm your password.\nPlease provide your password'
    );
  });

  it('Fail, it should NOT create a new client (no data)', async () => {
    const newClient = {};

    const response = await register(newClient);
    expect(response.status).to.eq(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please confirm your password.\nPlease provide your password.\nPlease provide your address.\nPlease provide your contact number.\nPlease provide your email.\nPlease provide your name'
    );
  });
});
