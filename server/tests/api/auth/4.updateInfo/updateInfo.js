const { expect } = require('chai');
require('dotenv').config();

const { login, updateInfo } = require('../../../util/response');
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
} = require('../../../util/db/index');

describe('Auth UpdateInfo API EndPoint', () => {
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

  it('Ok, it should update client information', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('client');
  });

  it('Fail, it should NOT update client information (not authenticated)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  it('Fail, it should NOT update client information (empty name)', async () => {
    const clientInfo = {
      name: '',
      email: 'email@email.com',
      contactNumber: '09123456789',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your name');
  });

  it('Fail, it should NOT update client information (empty email)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: '',
      contactNumber: '09123456789',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your email');
  });

  it('Fail, it should NOT update client information (wrong email format)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: 'email@email',
      contactNumber: '09123456789',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide a valid email.');
  });

  it('Fail, it should NOT update client information (empty contactNumber)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: 'email@email.com',
      contactNumber: '',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your contact number'
    );
  });

  it('Fail, it should NOT update client information (wrong contactNumber format)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: 'email@email.com',
      contactNumber: '13245678912',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      "Contact number must start with '09...'"
    );
  });

  it('Fail, it should NOT update client information (contactNumber length < 11)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: 'email@email.com',
      contactNumber: '09123456',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT update client information (contactNumber length > 11)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: 'email@email.com',
      contactNumber: '091234567899',
      address: 'new address',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT update client information (empty address)', async () => {
    const clientInfo = {
      name: 'Edited dummy sender',
      email: 'email@email.com',
      contactNumber: '09123456789',
      address: '',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please provide your address');
  });

  it('Fail, it should NOT update client information (empty field)', async () => {
    const clientInfo = {
      name: '',
      email: '',
      contactNumber: '',
      address: '',
    };

    const response = await updateInfo(clientInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Please provide your address.\nPlease provide your contact number.\nPlease provide your email.\nPlease provide your name'
    );
  });
});
