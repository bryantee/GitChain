'use strict';

document.addEventListener('DOMContentLoaded', e => {
  main();
});

const MOCK_DATA = {
  currentGoal: 'Finish mocking out API response for client.',
  currentCommitStreakDays: 5,
  commitsToday: 1,
}

function main() {
  function getData(callback) {
    setTimeout(function(){
      callback(MOCK_DATA)
    }, 1000);
  }

  function displayData(data) {
    console.log(data);
    let goal = document.querySelector('.current-goal');
    let commitStreak = document.querySelector('.commit-streak');
    let commitsToday = document.querySelector('.commits-today');

    goal.textContent = data.currentGoal;
    commitStreak.textContent = data.currentCommitStreakDays;
    commitsToday.textContent = data.commitsToday;
  }
  function getAndDisplayData(){
    getData(displayData);
  }

  getAndDisplayData();
}
