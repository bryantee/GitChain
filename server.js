'use static';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const ghRobot = require('./ghRobot');
const request = require('request');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const util = require('util');

// Get models
const User = require('./models/user');

// Declare global so function can be
// used throughout after import
let updateByUser;

const app = express();
app.use(express.static('public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'toast',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use('local', new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: "Incorrect username"});
      }
      user.validatePassword(password, error => {
        if (err) {
          return done(null, false, {message: "Incorrect username"});
        } else {
          return done(null, user);
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(403);
}

////////////////////////////
// Express Routes for API //
////////////////////////////

// Request update to github commit info
// returns 200 to let client know db update complete
app.post('/user/update/:username', ensureAuthenticated, (req, res) => {
  let username = req.user.username;
  updateByUser(username, () => {
    res.sendStatus(200);
  });
});

// Updating Goal for user
// Currently takes JSON object with username and new goal
// Returns JSON object with new goal
app.put('/users/:user/goal', ensureAuthenticated, (req, res) => {
  if (req.user.username !== req.params.user) {
    return res.sendStatus(403);
  }

  let user = req.user.username;
  let goal = req.body.currentGoal;

  let query = {
    username: user
  };

  let update = {
    $set: {
      currentGoal: goal
    }
  };

  User.findOneAndUpdate(query, update, {}, (err, result) => {
    if (!result) {
        return res.status(404).send('No matching user: ' + user);
    } else if (err) {
      return res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json({ currentGoal: goal });
    }
  });
});

// Get all user info for dashboard
app.get('/users/:user', ensureAuthenticated, (req, res) => {
  let username = req.user.username;

  let query = {
    username
  };

  User.findOne(query, (err, result) => {
    if (!result) {
      return res.status(404).send('Bad username: ' + username);
    } else if (err) {
      return res.status(500).send('Error: ', err);
    }

    // TODO: repackage object literal to deliver to client
    //       ex: object includes password (hashed)
    result['password'] = 'PRIVATE';
    res.status(200).json(result);
  });
});

// signup user
app.post('/users', (req, res) => {
  let username = req.body.username.trim();
  let password = req.body.password.trim();

  bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return console.log(`error: ${err}`);
      }
      bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return console.log(`error: ${err}`);
          }

          let userObj = {
            username: username,
            password: hash,
            lastCheck: new Date(),
            highStreak: 0,
            currentCommitStreakDays: 0,
            currentGoal: "Double click here to set your goal for the moment.",
            streakDates: []
          };

          const url = "https://api.github.com/users/" + username;

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
              userObj.avatar = body.avatar_url;
              userObj.url = body.url;
              userObj.bio = body.bio;
              userObj.location = body.location;

              User.create(userObj, (err, result) => {
                if (err) {
                  console.error(`ERROR: ${err}`);
                  return res.status(500).json({
                    message: `Internal server error: ${err}`
                  });
                }

                result['password'] = 'PROTECTED';
                res.status(201).json(result);
              });
            }
          })
        });
      });
  });

// authenticate user
app.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    let redirectURL = '/user/' + req.user.username;
    res.status(200).json({
      "success": true,
    });
  }
});

// pointless endpoint for testing
// will keep in for future tests
app.get('/is-login', (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

// logout user
app.get('/logout', (req, res) => {
  req.logout();
  res.status(401).redirect('/');
});

// Get all users (for testing purposes)
app.get('/users', (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
    res.status(200).json(users);
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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
    updateByUser = ghRobot();
  });
}

module.exports.app = app;
module.exports.runServer = runServer;
