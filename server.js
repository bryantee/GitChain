'use static';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const ghRobot = require('./ghRobot');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(express.static('src'));

// Get models
const User = require('./models/user');

////////////////////////////
// Express Routes for API //
////////////////////////////

// Updating Goal for user
// Currently takes JSON object with username and new goal
// Returns JSON object with new goal
app.put('/users/:user/goal', (req, res) => {
  let id = req.params.user;
  let username = req.body.username;
  let goal = req.body.currentGoal;

  let update = {
    $set: {
      currentGoal: goal
    }
  };

  let options = {};

  User.findByIdAndUpdate(id, update, options, (err, result) => {
    if (!result) {
        return res.status(404).send('Bad id: ' + id);
    } else if (err) {
      return res.status(500).send('Error: ' + err);
    } else if (username !== result.username ) {
      return res.status(400).send('Username ' + username + ' doesn\'t match user on serving using id ' + id);
    }
    res.status(201).json({
      currentGoal: goal
    });
  });

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
let userObj = {
  username: username,
  lastCheck: new Date()
};
  // Get initial github data
  // TODO: Get data from GH and build object to store in DB

  const url = "https://api.github.com/users/" + username;
  console.log(url);

  request({
    url: url,
    json: true,
    headers: {
      'User-Agent': 'javascript'
    }
  }, (err, response, body) => {
    if (err) return console.log(`Error making request to Github: ${err}`);
    if (response.statusCode !== 200) return console.log(`Status code: ${response.statusCode}`);
    if (response.statusCode === 200) {
      console.log(`Successful response from GH for user: ${username}`);
      userObj.avatar = body.avatar_url;
      // Can get more info here in the future
      // But for now only care about avatar_url

      User.create(userObj, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error'
          });
        }
        res.status(201).json(result);
      });
    }
  })
});

// authenticate user
app.post('/session', (req, res) => {

});

// logout user
app.delete('/session', (req, res) => {

});

// Get all users (for testing purposes)
app.get('/users', (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
    // console.log(users);
    res.status(200).json(users);
  });
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
    ghRobot();
  });
}

module.exports.app = app;
module.exports.runServer = runServer;
