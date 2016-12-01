const gh = require('github_simplestat');
const schedule = require('node-schedule');
const User = require('./models/user');
const mongoose = require('mongoose');


function scheduler() {
  console.log('Executing scheduler');

  // setup promise to be used for each request to GH
  function getGHData(username) {
    return new Promise(function(resolve) {
      gh.valid_data(username, null, data => {
        console.log(`Looking up: ${username}`);
        resolve(data);
      });
    });
  };

  function loopThroughUsers() {
    let usernames = [];
    typeof usernames;
    User.find((err, users) => {
      if (err) console.log(`Error: ${err}`);
      for (let i = 0; i < users.length; i++) {
        usernames.push(users[i].username);
        console.log(users[i].username);
        console.log(usernames);
      }
    });

  }

  // TODO: Setup cron scheduler
  // Cront scheuler
  let rule = new schedule.RecurrenceRule();
  rule.second = 1;

  schedule.scheduleJob(rule, loopThroughUsers);

  // Run test
  // getGHData('ljharb').then(function(data) {
  //   console.log('Inside the promise then function:');
  //   console.log(data);
  //   return data;
  // }).then(function(data) {
  //   if (data.today_count === 0) console.log('No commits for today');
  //   if (data.today_count !== 0) {
  //     console.log('Commits!');
      // update user in db
      // find user in database and update streak++
  //   }
  // });
}

// TODO: Loop through users and run getGHData on each
// cron('5 hours', function() {
//   User.find(
//     "lastUpdate" : {
//       $gte:
//     }
//   )
// })


module.exports = scheduler;
