const gh = require('github_simplestat');
const schedule = require('node-schedule');
const User = require('./models/user');
const mongoose = require('mongoose');
const moment = require('moment');


function scheduler() {
  console.log('Executing scheduler');

  let updateByUser = function (username, callback) {
    // make each call to github witthh username
    getGHData(username).then(function (data) {
      // console.log(data);
      return data;
    }).then(function (data) {

      ///////////////////////////////////////////////
      // Get initial info on user currently in DB //
      /////////////////////////////////////////////

      User.find({ username}, (err, result) => {
        if (err) {
          console.log(`Error: ${err}`);
        }

        // Establish some variables

        let today = moment(); // Get day
        let twoDaysAgo = moment().subtract(2, 'days'); // Two days ago
        let streakDates; // Current array of streak dates
        let lastStreakDate; // Last date with streak increment
        let lastCheck = result[0].lastCheck; // When was it last checked
        let highStreak = result[0].highStreak; // High streak
        let currentStreak = result[0].currentCommitStreakDays; //Current streak
        console.log(`last check: ${lastCheck}`);
        console.log(`high streak: ${highStreak}`);
        console.log(`Currentstreak:${currentStreak}`);


        if (result.hasOwnProperty('streakDates')) {
          streakDates = result.streakDates;
          lastStreakDate = streakDates[streakDates.length - 1];
          console.log(`streak dates: ${streakDates}`);
          console.log(`last streak date: ${lastStreakDate}`);
        }

        /////////////////////
        // Makes decisions //
        ////////////////////

        // If no commits, do a few things and save info to DB
        if (data.today_count === 0) {
          console.log('No commits for today, setting streak to 0 :(');

          // Params to pass to mongoose update method
          let query = {
            username
          };
          let options = {};
          let update = {
            $set: {
              lastCheck: new Date(),
              commitsToday: data.today_count
            }
          };

          // Add check for time being after 11:55pm
          // If so, set streak back to 0. Sorry.
          if ( moment().isAfter.moment('23:55', 'HH:mm') ) {
            update.$set.currentCommitStreakDays = 0;
          }

          // TODO: Refactor to make this happen once after if / else statements
          // update DB
          User.findOneAndUpdate(query, update, options, (err, result) => {
            if (err) {
              return console.log(`ERROR: ${err}`);
            }
            console.log(`User ${username} is successfully updated with latest info`);
            if (callback) callback();
          });

          // If there are commits....
          // Do some checks and update accordingly
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
              lastCheck: new Date(),
            }
          };

          if (currentStreak === 0) {
            console.log('current streak is zero, setting to 1');
            update.$set.currentCommitStreakDays = 1;
            update.$set.highStreak = 1;
            update.$addToSet = {
              streakDates: new moment()
            };
          }

          // Increment streak and hight streak if needed
          if (streakDates && lastStreakDate.isBefore(today, 'day') && lastStreakDate.isAfter(twoDaysAgo, 'day')) {
            update.$inc.currentCommitStreakDays = 1;
            if ((currentStreak + 1) > highStreak) {
              update.$inc.highStreak = 1;
            }
          }

          User.findOneAndUpdate(query, update, {}, (err, result) => {
            if (err) {
              return console.log(`ERROR: ${err}`);
            }
            console.log(`User ${username} is successfully updated with (${data.today_count}) new commits in db`);
            if (callback) callback();
          });
        }
      });
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
        updateByUser(users[i].username);
      }
    });
  }

  // Cron scheuler
  let rule = new schedule.RecurrenceRule();
  rule.second = 01;
  rule.minute = 58;
  rule.hour = 23;

  // kick off job scheduler
  schedule.scheduleJob(rule, loopThroughUsers);

  // return this function to be used in server.js endpoints
  return updateByUser;

}

module.exports = scheduler;
