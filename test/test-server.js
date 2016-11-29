'use strict';

global.DATABASE_URL = 'mongodb://localhost/gitchain-test';

const server = require('../server');
const User = require('../models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

describe('GitChain API', () => {
  // seed db
  before( done => {
    server.runServer( () => {
      User.create(
        {
          username: 'jason-voorhees',
          avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
          currentGoal: 'MURDERRR.',
          currentCommitStreakDays: 5,
          commitsToday: 1,
          highStreak: 15
        },
        {
          username: 'freddy-krueger',
          avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
          currentGoal: 'Slice children faces off',
          currentCommitStreakDays: 10,
          commitsToday: 7,
          highStreak: 27
        }, function() {
            done();
        });
    });
  });

  // tear down db
  after( done => {
    User.remove( () => {
      done();
    });
  });

  // start actual tests
  it('should return 200 status and html on get "/"', done => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
