const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('express');
const mongoose = require('mongoose');
const app = require('../../../../app');
require('dotenv').config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

chai.should();

chai.use(chaiHttp);

describe('Auth UpdatePassword API Endpoint', () => {
  let token;

  before((done) => {
    mongoose
      .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        const clientInfo = {
          email: 'dummysender@mailsac.com',
          password: 'testpassword',
        };

        chai
          .request(app)
          .post('/api/v1/auth/login')
          .send(clientInfo)
          .then((response) => {
            token = response.body.token;
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  after((done) => {
    mongoose
      .disconnect()
      .then(() => done())
      .catch((err) => done(err));
  });

  it('Okay, it should update the client', (done) => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(200);
        response.body.should.have.property('data').property('client');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (wrong current password)', (done) => {
    const clientPassword = {
      currentPassword: 'wrongcurrentpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Incorrect Current Password!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (new password dont match)', (done) => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword1',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq("Password don't match");
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (not authenticated)', (done) => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .then((response) => {
        response.should.have.status(401);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please login to continue');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (no current password)', (done) => {
    const clientPassword = {
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please input your credentials!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (no new password)', (done) => {
    const clientPassword = {
      currentPassword: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please input your credentials!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (must confirm new password)', (done) => {
    const clientPassword = {
      currentPassword: 'testpassword',
      password: 'testpassword',
    };

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please input your credentials!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT update (no data)', (done) => {
    const clientPassword = {};

    chai
      .request(app)
      .patch('/api/v1/auth/update-password')
      .send(clientPassword)
      .set('Cookie', `jwt=${token}`)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please input your credentials!');
        done();
      })
      .catch((err) => done(err));
  });
});
