const supertest = require('supertest');
const app = require('../../../app');
const request = supertest(app);

exports.login = (data) => {
  return request.post('/api/v1/auth/login').send(data);
};

exports.register = (data) => {
  return request.post('/api/v1/auth/register').send(data);
};

exports.updatePassword = (data, token = '') => {
  return request
    .patch('/api/v1/auth/update-password')
    .send(data)
    .set('Cookie', `jwt=${token}`);
};

exports.updateInfo = (data, token = '') => {
  return request
    .patch('/api/v1/auth/update-info')
    .send(data)
    .set('Cookie', `jwt=${token}`);
};

exports.forgotPassword = (data) => {
  return request.post('/api/v1/auth/forgot-password').send(data);
};

exports.resetPassword = (data, token = '') => {
  return request.post(`/api/v1/auth/reset-password/${token}`).send(data);
};

exports.addUser = (data, token = '') => {
  return request
    .post('/api/v1/clients/users')
    .send(data)
    .set('Cookie', `jwt=${token}`);
};

exports.send = (requestType, endpoint, data) => {
  return requestType(endpoint).send(data);
};

exports.sendWithCookie = (requestType, endpoint, data = '', token = '') => {
  return requestType(endpoint).send(data).set('Cookie', `jwt=${token}`);
};
