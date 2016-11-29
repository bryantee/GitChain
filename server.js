'use static';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('build'));

// Get models
const User = require('./models/user');

////////////////////////////
// Express Routes for API //
////////////////////////////

// Updating Goal for user
app.post('/users/:user/goal', (req, res) => {

});

// Get all user info for dashboard
app.get('/users/:user', (req, res) => {

});

// signup user
app.post('/users', (req, res) => {

});

// get webpage for user signup
app.get('/users/new', (req, res) => {

});

// sign in
app.get('/session/new')

// authenticate
app.post('/session')



////////////////////////
// End Routes //////////
////////////////////////

// Startup server
const runServer = function(callback) {
  mongoose.connect(config.DATABASE_URL, err => {
    if (err && callback) {
      return callback(err);
    }

    app.listen(config.PORT, () => {
      console.log(`Listening on port ${config.PORT}`);
      if (callback) {
        callback();
      }
    });
  });
};

// Check if server.js is being called directly or through ./require
if (require.main === module) {
  runServer(err => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = app;
