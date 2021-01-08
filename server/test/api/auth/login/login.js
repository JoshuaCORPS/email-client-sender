const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../../../../app');
require('dotenv').config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Auth Login API Endpoint', () => {
  before((done) => {
    mongoose
      .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    mongoose
      .disconnect()
      .then(() => done())
      .catch((err) => done(err));
  });

  it('Ok, it should login the client', (done) => {
    const clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(clientInfo)
      .then((response) => {
        response.should.have.status(200);
        response.body.should.have.property('status').eq('success');
        response.body.should.have.property('data').property('client');

        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT login (wrong password)', (done) => {
    const clientInfo = {
      email: 'dummysender@mailsac.com',
      password: 'wrongpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(clientInfo)
      .then((response) => {
        response.should.have.status(401);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Incorrect email or password');

        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT login (no email)', (done) => {
    const clientInfo = {
      password: 'wrongpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(clientInfo)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your email and password to proceed');

        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT login (no password)', (done) => {
    const clientInfo = {
      email: 'dummysender@mailsac.com',
    };

    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(clientInfo)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your email and password to proceed');

        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT login (no password)', (done) => {
    const clientInfo = {};

    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(clientInfo)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your email and password to proceed');

        done();
      })
      .catch((err) => done(err));
  });
});
