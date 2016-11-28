'use static';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(express.static('build'));

// Get models
const User = require('./models/user');

////////////////////////////
// Express Routes for API //
////////////////////////////

// Updating Goal for user
app.post('/:user/goal', (req, res) => {

});

// Get all user info for dashboard
app.get('/:user', (req, res) => {

});

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
