import { expect } from 'chai';

const app = require('../../server');
const request = require('supertest')(app);

describe('Missing', () => {

  let response;

  before(done => {
    request.get('/this-route-will-never-exist-hopefully')
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        response = res.body;
        done();
    });
  });

  it('should return an error indicating no route match', () => {
    expect(response).to.have.property('error', 'No route match');
  });

});
