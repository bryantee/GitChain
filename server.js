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
  let id = req.params.user;
  
  let query = {
    _id: id
  };

  User.findOne(query, (err, result) => {
    if (!result) {
      return res.status(404).send('Bad id: ' + id);
    } else if (err) {
      return res.status(500).send('Error: ', err);
    }

    // Return json identical from User schema in DB
    // Is this smart? OR should I always repackage it here
    // before sending?
    res.status(200).json(result);
  });
});

// signup user
app.post('/users', (req, res) => {
  let username = req.body.username;
  User.create({
    username: username
  }, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
    res.status(201).json(result);
  });
});

// get webpage for user signup
app.get('/users/new', (req, res) => {

});

// Get webpage for user sign in
app.get('/session/new', (req, res) => {

});

// authenticate
app.post('/session', (req, res) => {

});

// logout
app.delete('/session', (req, res) => {

});

////////////////////////
// End Routes //////////
////////////////////////

// Startup server
const runServer = function(callback) {
  mongoose.connect(config.DATABASE_URL, err => {
    if (err && callback) {
      return callback(err);
    }

    console.log(`Connected to db at ${config.DATABASE_URL}`);

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
module.exports.runServer = runServer;
