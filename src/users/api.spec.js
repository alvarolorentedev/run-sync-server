import { expect } from 'chai';
import sinon from 'sinon';

const UserService = require('./service');
const app = require('../../server');
const request = require('supertest')(app);

describe('Users API', () => {

  let sandbox;
  let findStub;
  let findOneStub;
  let createStub;
  let updateStub;
  let removeStub;

  const mockResult = {
    _id: '123123123123123123123123', // has to match MongoDB ObjectID pattern 24 characters of hex
    email: 'test@test.com',
    password: '123',
    created: '123123123',
    updated: '123123123',
    role: true
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    findStub = sandbox.stub(UserService, 'find');
    findOneStub = sandbox.stub(UserService, 'findOne');
    createStub = sandbox.stub(UserService, 'create');
    updateStub = sandbox.stub(UserService, 'update');
    removeStub = sandbox.stub(UserService, 'remove');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('List', () => {

    beforeEach(() => {
      findStub.yields(null, [mockResult]);
    });

    it('should return an array of users', (done) => {
      request.get('/users').expect('Content-Type', /json/).expect(200).end(function (err, res) {
        expect(err).to.equal(null);
        expect(Array.isArray(res.body.data)).to.equal(true);
        expect(res.body.data).to.eql([mockResult]);
        done();
      });
    });

    it('should return a standard error when it fails', (done) => {
      findStub.yields(new Error('test fail'), null);

      request.get('/users').expect('Content-Type', /json/).expect(500).end(function (err, res) {
        expect(err).to.equal(null);
        expect(res.body).to.have.property('error', 'Internal Server Error');
        done();
      });
    });

  });

  describe('Register', () => {

    it('should return a 201 and the created document if successful', (done) => {

      createStub.yields(null, {
        _id: '_id',
        email: 'test@email.com',
        password: 'some_encrypted_pass',
        created: 'created',
        updated: 'updated',
        role: true
      });

      request.post('/users')
        .send({
          first_name: 'test',
          last_name: 'name',
          email: 'email@email.com',
          password: '123',
          contact_number: '123'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body.data).to.have.property('_id');
          expect(res.body.data).to.have.property('role');
          expect(res.body.data).to.have.property('email');
          // Dont return encrypted password
          expect(res.body.data).to.not.have.property('password');
          done();
        });
    });

    it('should return a 400 if no payload submitted', (done) => {
      request.post('/users')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Invalid parameters supplied.');
          done();
        });
    });

    it('should return a 400 if payload is missing required parameters', (done) => {
      request.post('/users')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Invalid parameters supplied.');
          done();
        });
    });

    it('should return a standard error when it fails', (done) => {
      createStub.yields(new Error('test fail'), null);

      request.post('/users')
        .send({
          email: 'email@email.com',
          password: '123'
        })
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Internal Server Error');
          done();
        });
    });

  });

  describe('Fetch', () => {

    beforeEach(() => {
      findOneStub.yields(null, mockResult);
    });

    it('should retrieve a specific user', (done) => {
      request.get(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body.data).to.have.property('_id', mockResult._id);
          expect(res.body.data).to.have.property('email', mockResult.email);
          expect(res.body.data).to.have.property('role', mockResult.role);
          expect(res.body.data).to.have.property('created');
          expect(res.body.data).to.have.property('updated');
          done();
        });
    });

    it('should return a 404 if no specific user', (done) => {
      findOneStub.yields(null, null);

      request.get(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'User not found.');
          done();
        });
    });

    it('should return a standard error when it fails', (done) => {
      findOneStub.yields(new Error('test fail'), null);

      request.get(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Internal Server Error');
          done();
        });
    });
  });

  describe('Update', () => {

    const mockId = 'abc123abc123abc123abc123';

    it('should return a 200 and the updated document if successful', (done) => {
      updateStub.yields(null, mockResult);

      request.put(`/users/${mockId}`)
        .send({
          name: 'test'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body.data).to.have.property('_id');
          expect(res.body.data).to.have.property('email');
          expect(res.body.data).to.have.property('role');
          expect(res.body.data).to.have.property('created');
          expect(res.body.data).to.have.property('updated');
          done();
        });
    });

    it('should return a 400 if no payload submitted', (done) => {
      request.put(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Invalid parameters supplied.');
          done();
        });
    });

    it('should return a 400 if payload is missing required parameters', (done) => {
      request.put(`/users/${mockResult._id}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Invalid parameters supplied.');
          done();
        });
    });

    it('should return a standard error when it fails', (done) => {
      updateStub.yields(new Error('test fail'), null);

      request.put(`/users/${mockResult._id}`)
        .send({
          name: 'test'
        })
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Internal Server Error');
          done();
        });
    });

  });

  describe('Remove', () => {

    it('should return a 200 if user removed successfully', (done) => {
      removeStub.yields(null, mockResult);

      request.del(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err) {
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return a 404 if no specific user', (done) => {
      removeStub.yields(null, null);

      request.del(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'User not found.');
          done();
        });
    });

    it('should return a standard error when it fails', (done) => {
      removeStub.yields(new Error('test fail'), null);

      request.del(`/users/${mockResult._id}`)
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.body).to.have.property('error', 'Internal Server Error');
          done();
        });
    });
  });

});
