'use strict';

const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

describe('Server', () => {
  it('should return 200 status on get "/"', done => {
    chai.request(server)
      .get('/')
      .set('Accept', 'text/html')
      .end((err, res) => {
        console.log(res);
        res.should.have.status(200);
        done();
      });
  });
});
