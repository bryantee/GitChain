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
      app.request.isAuthenticated = function() {
        return true;
      }
      User.create(
        {
          username: 'jason-voorhees',
          password: '123',
          avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
          currentGoal: 'MURDERRR.',
          currentCommitStreakDays: 5,
          commitsToday: 1,
          highStreak: 15,
          lastCommit: new Date(),
          lastCheck: new Date()
        },
        {
          username: 'freddy-krueger',
          password: '123',
          avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
          currentGoal: 'Slice children faces off',
          currentCommitStreakDays: 10,
          commitsToday: 7,
          highStreak: 27,
          lastCommit: new Date(),
          lastCheck: new Date()
        }, function() {
            done();
        });
    });
  });

  // tear down db
  after( done => {
    app.request.isAuthenticated = function() {
      return false;
    }
    User.remove( () => {
      done();
    });
  });

  // HAPPY PATH TESTS
  // it('should return 200 status and html on get "/"', done => {
  //   chai.request(server)
  //     .get('/')
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       done();
  //     });
  // });
  it('should return JSON with values for user on "/users/:user"', done => {
    app.request.user = {
      username: 'jason-voorhees',
      password: '123',
      avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
      currentGoal: 'MURDERRR.',
      currentCommitStreakDays: 5,
      commitsToday: 1,
      highStreak: 15,
      lastCommit: new Date(),
      lastCheck: new Date()
    }
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        let username = res.body[0].username;
        chai.request(app)
          .get('/users/' + username)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('username', 'jason-voorhees');
            res.body.should.have.property('avatar');
            res.body.should.have.property('currentGoal', 'MURDERRR.');
            res.body.should.have.property('currentCommitStreakDays', 5);
            res.body.should.have.property('commitsToday', 1);
            res.body.should.have.property('highStreak', 15);
            res.body.should.have.property('lastCommit');
            done();
          })
      })
  });
  it('should update goal in database on POST to "/users/:user/goal"', done => {
    app.request.user = {
      username: 'freddy-krueger',
      password: '123',
      avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
      currentGoal: 'Slice children faces off',
      currentCommitStreakDays: 10,
      commitsToday: 7,
      highStreak: 27,
      lastCommit: new Date(),
      lastCheck: new Date()
    }
    chai.request(app)
      .put('/users/freddy-krueger/goal')
      .send({'username': 'freddy-krueger', 'currentGoal': 'Pick all the flowers'})
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('currentGoal', 'Pick all the flowers')
        chai.request(app)
          .get('/users/freddy-krueger')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('username', 'freddy-krueger');
            res.body.should.have.property('avatar');
            res.body.should.have.property('currentGoal', 'Pick all the flowers');
            res.body.should.have.property('currentCommitStreakDays', 10);
            res.body.should.have.property('commitsToday', 7);
            res.body.should.have.property('highStreak', 27);
            res.body.should.have.property('lastCommit');
            done();
          });
        });
  });
  it('should add new user to db on POST to "/users" w valid JSON', done => {
    app.request.user = {
      username: 'norman-bates',
      password: 123
    }
    chai.request(app)
      .post('/users')
      .send({ 'username': 'norman-bates', 'password': '123' })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('username', 'norman-bates');
        chai.request(app)
          .get('/users')
          .end((err, res) => {
            let username = res.body[2].username;
            chai.request(app)
              .get('/users/' + username)
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('username', 'norman-bates');
                done();
              });
          });
      });
  });
});
