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

describe('Auth Register API Endpoint', () => {
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

  it('Ok, it should create a new client', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(201);
        response.body.should.have.property('message');
        response.body.should.have.property('status').eq('success');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (duplicate)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Email already exist.');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, It should NOT create a new client (no name)', (done) => {
    const newClient = {
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your name');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (no email)', (done) => {
    const newClient = {
      name: 'test sender',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your email');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (invalid email format)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'invalid@email',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide a valid email.');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (no contactNumber)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your contact number');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (contactNumber must start with 09...)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '12345678901',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq("Contact number must start with '09...'");
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (contactNumber must only have 11 digits)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '0932165498',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Contact number must only have 11 digits');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (contactNumber must only have 11 digits)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '093216549843',
      address: 'Marilao Bulacan',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Contact number must only have 11 digits');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (no address)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please provide your address');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (no password)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      passwordConfirm: 'testpassword',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq("Please provide your password.\nPassword don't match");
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (password must have atleast 8 char)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: '1234567',
      passwordConfirm: '1234567',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Password must have atleast 8 characters');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (must confirm password)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: '12345678',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please confirm your password');
        done();
      })
      .catch((err) => done(err));
  });

  it("Fail, it should NOT create a new client (password don't match)", (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
      password: '12345678',
      passwordConfirm: '123456789',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
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

  it('Fail, it should NOT create a new client (no password and passwordConfirm)', (done) => {
    const newClient = {
      name: 'test sender',
      email: 'clientsender@mailsac.com',
      contactNumber: '09123465789',
      address: 'Marilao Bulacan',
    };

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq('Please confirm your password.\nPlease provide your password');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, it should NOT create a new client (no data)', (done) => {
    const newClient = {};

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(newClient)
      .then((response) => {
        response.should.have.status(400);
        response.body.should.have.property('status').eq('fail');
        response.body.should.have
          .property('message')
          .eq(
            'Please confirm your password.\nPlease provide your password.\nPlease provide your address.\nPlease provide your contact number.\nPlease provide your email.\nPlease provide your name'
          );
        done();
      })
      .catch((err) => done(err));
  });
});