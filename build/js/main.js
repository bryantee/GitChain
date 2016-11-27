'use strict';

// look ma, no jQuery
document.addEventListener('DOMContentLoaded', e => {
  main();
});

// Object for all mock data during client mockup phase
const MOCK_DATA = {
  username: 'bryantee',
  currentGoal: 'Finish mocking out API response for client.',
  currentCommitStreakDays: 5,
  commitsToday: 1
}

// Main function to call in "document ready"
function main() {

  // This is currently mocked up with timeout
  // But will be replaced with an AJAX call to backend once complete
  function getData(callback) {
    setTimeout(function(){
      callback(MOCK_DATA)
    }, 1000);
  }

  // Takes response from AJAX to render data on page
  function displayData(data) {
    console.log(data);
    let username = document.querySelector('.username');
    let goal = document.querySelector('.current-goal');
    let commitStreak = document.querySelector('.commit-streak');
    let commitsToday = document.querySelector('.commits-today');

    username.textContent = data.username;
    goal.textContent = data.currentGoal;
    commitStreak.textContent = data.currentCommitStreakDays;
    commitsToday.textContent = data.commitsToday;
  }

  // Combines AJAX and render functions
  function getAndDisplayData(){
    getData(displayData);
  }

  // Makes the call
  getAndDisplayData();
}