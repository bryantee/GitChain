const gh = require('github_simplestat');
const schedule = require('node-schedule');
const User = require('./models/user');
const mongoose = require('mongoose');
const moment = require('moment');


function scheduler() {
  console.log('Executing scheduler');

  let updateByUser = function(username, callback) {
    // make each call to github witthh username
    // returns
    getGHData(username).then(function(data) {
      // console.log(data);
      return data;
    }).then(function(data) {
      if (data.today_count === 0) {
        console.log('No commits for today');

        let query = { username };
        let update = {
          $set: {
            lastCheck: new Date()
          }
        };
        let options = {};

        User.findOneAndUpdate(query, update, options, (err, result) => {
          if (err) {
            return console.log(`ERROR: ${err}`);
          }
          console.log(`User ${username} is successfully updated with latest check`);
          if (callback) callback();
        });

      } else if (data.today_count !== 0) {
        console.log('Commits!');
        // update user in db
        // find user in database and update streak++
        let query = {
          username
        };

        let update = {
          $set: {
            commitsToday: data.today_count,
            lastCheck: new Date()
          }
        };

        if (data.today_count === 0) {
          update.$set = {
            currentCommitStreakDays: 0
          }
        } else {
          update.$inc = {
            currentCommitStreakDays: 1
          }
        }

        let options = {};

        User.findOneAndUpdate(query, update, options, (err, result) => {
          if (err) {
            return console.log(`ERROR: ${err}`);
          }
          console.log(`User ${username} is successfully updated with (${data.today_count}) new commits in db`);
          if (callback) callback();
        });
      }
    // }).then( data => {
    //   console.log('updateByUser Resolved!');
    //   return new Promise( resolve => {
    //     resolve('resolved');
    //   });
    });
  }

  // setup promise to be used for each request to GH
  function getGHData(username) {
    return new Promise(function(resolve) {
      gh.valid_data(username, null, data => {
        console.log(`Looking up: ${username}`);
        resolve(data);
      });
    });
  };

  let loopThroughUsers = function() {
    console.log('Executing loop'); // Sanity check

    // Get all users from database
    User.find((err, users) => {
      if (err) console.log(`Error: ${err}`);
      for (let i = 0; i < users.length; i++) {
        let username = users[i].username;

        updateByUser(username);
      }
    });

  }

  // TODO: Setup cron scheduler
  // Cront scheuler
  let rule = new schedule.RecurrenceRule();
  rule.second = 59;
  rule.minute = 59;
  rule.hour = 23;

  schedule.scheduleJob(rule, loopThroughUsers);

  return updateByUser;

}

// TODO: Loop through users and run getGHData on each
// cron('5 hours', function() {
//   User.find(
//     "lastUpdate" : {
//       $gte:
//     }
//   )
// })

// // setup promise to be used for each request to GH
// function getGHData(username) {
//   return new Promise(function(resolve) {
//     gh.valid_data(username, null, data => {
//       console.log(`Looking up: ${username}`);
//       resolve(data);
//     });
//   });
// };
//
//
// // Run test
// getGHData('ljharb').then(function(data) {
//   console.log('Inside the promise then function:');
//   console.log(data);
//   return data;
// }).then(function(data) {
//   if (data.today_count === 0) console.log('No commits for today');
//   if (data.today_count !== 0) {
//     console.log('Commits!');
//     // update user in db
//     // find user in database and update streak++
//   }
// });


module.exports = scheduler;
