'use static';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(express.static('build'));

// Get model
const User = require('./models/user');



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

if (require.main === module) {
  runServer(err => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = app;
