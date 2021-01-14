const { expect } = require('chai');
require('dotenv').config();

const User = require('../../../../models/userModel');
const { login, addUser, updateUser } = require('../../../util/response');
const {
  connect,
  disconnect,
  createClient,
  deleteClients,
  deleteUsers,
} = require('../../../util/db');

describe('Client Update User API Endpoint', () => {
  let token;
  let userid;

  before(async () => {
    await connect();
    await createClient();

    const response = await login({
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    });

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

    const response2 = await addUser(newUser, token);
    userid = response2.body.data.user.id;
  });

  after(async () => {
    await deleteClients();
    await deleteUsers();
    await disconnect();
  });

  it('Ok, it should update user', async () => {
    const updatedUserInfo = {
      name: 'updated test user',
    };
    const response = await updateUser(userid, updatedUserInfo, token);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.have.property('user');
  });

  it('Fail, it should NOT update user (billcategory dont exist)', async () => {
    const updatedUserInfo = {
      name: 'updated test user',
      billCategory: 'category that dont exist',
    };
    const response = await updateUser(userid, updatedUserInfo, token);
    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Category not found');
  });

  it('Fail, it should NOT update user (not authenticated)', async () => {
    const updatedUserInfo = {
      name: 'updated test user',
    };
    const response = await updateUser(userid, updatedUserInfo);
    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('Please login to continue');
  });

  // it('Fail, it should NOT update user (user already exist in category)', async () => {
  //   const newUser = {
  //     name: 'Test User',
  //     email: 'testsenderuser@mailsac.com',
  //     contactNumber: '09596798461',
  //     address: 'Marilao Bulacan',
  //     monthlyBill: 1600,
  //     billDate: '12/22/2020',
  //     billCategory: 'Electricity',
  //   };

  //   const createUser = await addUser(newUser, token);
  //   userid = createUser.body.data.user.id;

  //   console.log(await User.find());

  //   const updatedUserInfo = {
  //     billCategory: 'Internet',
  //   };
  //   const response = await updateUser(userid, updatedUserInfo, token);
  //   console.log(response.body);
  //   expect(response.status).to.equal(400);
  //   expect(response.body.status).to.equal('fail');
  //   expect(response.body.message).to.equal(
  //     'This user already exist in this billing category!'
  //   );
  // });

  it('Fail, it should NOT update user (user dont exist)', async () => {
    const updatedUserInfo = {
      name: 'updated test user',
    };
    const response = await updateUser('somerandomid', updatedUserInfo, token);
    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal('user not found');
  });

  it('Fail, it should NOT update user (wrong contactNumber format)', async () => {
    const updatedUserInfo = {
      contactNumber: '46548998712',
    };
    const response = await updateUser(userid, updatedUserInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      "Contact number must start with '09...'"
    );
  });

  it('Fail, it should NOT update user (contactNumber length < 11)', async () => {
    const updatedUserInfo = {
      contactNumber: '0912345678',
    };
    const response = await updateUser(userid, updatedUserInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });

  it('Fail, it should NOT update user (contactNumber length > 11)', async () => {
    const updatedUserInfo = {
      contactNumber: '091234567899',
    };
    const response = await updateUser(userid, updatedUserInfo, token);
    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.message).to.equal(
      'Contact number must only have 11 digits'
    );
  });
});
