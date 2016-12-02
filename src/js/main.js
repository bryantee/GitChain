'use strict';

// look ma, no jQuery
document.addEventListener('DOMContentLoaded', e => {
  main();
  eventListeners();
});

// Object for all mock data during client mockup phase
const MOCK_DATA = {
  username: 'bryantee',
  avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
  currentGoal: 'Finish mocking out API response for client.',
  currentCommitStreakDays: 5,
  commitsToday: 1,
  highStreak: 15
}

function eventListeners() {

  // views
  let profileView = document.querySelector('#profile-view');
  let signUpView = document.querySelector('#signup-view');
  let logInView = document.querySelector('#login-view');
  let welcomeView = document.querySelector('#welcome-view');
  let logoutView = document.querySelector('#logout-view');

  // buttons
  let profileBtn = document.querySelector('#profile-btn');
  let signUpBtn = document.querySelector('#signup-btn');
  let logInBtn = document.querySelector('#login-btn');
  let welcomeBtn = document.querySelector('#welcome-btn');
  let logoutBtn = document.querySelector('#logout-btn');

  function resetViews() {
    let views = document.querySelectorAll('.view');
    for (let i = 0; i < views.length; i++ ) {
      views[i].classList.remove('show');
      views[i].classList.add('hide');
    }
  }

  function resetTabs() {
    let tabs = document.querySelectorAll('.is-tab');
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('is-active');
    }
  }

  ////////////////////////////////
  // Event listeners for buttons//
  ////////////////////////////////

  // welcome
  welcomeBtn.addEventListener('click', e => {
    resetViews();
    welcomeView.classList.add('show');
    welcomeView.classList.remove('hide');
    resetTabs();
    welcomeBtn.classList.add('is-active');
  });

  // profile
  profileBtn.addEventListener('click', e => {
    resetViews();
    profileView.classList.add('show');
    profileView.classList.remove('hide');
    resetTabs();
    profileBtn.classList.add('is-active');
  });

  // logout
  logoutBtn.addEventListener('click', e => {
    resetViews();
    logoutView.classList.add('show');
    logoutView.classList.remove('hide');
    resetTabs();
    logoutBtn.classList.add('is-active');
  });

  // signup
  signUpBtn.addEventListener('click', e => {
    resetViews();
    signUpView.classList.add('show');
    signUpView.classList.remove('hide');
    resetTabs();
    signUpBtn.classList.add('is-active');
  });

  //login
  logInBtn.addEventListener('click', e => {
    resetViews();
    logInView.classList.add('show');
    logInView.classList.remove('hide');
    resetTabs();
    logInBtn.classList.add('is-active');
  });

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
    let avatar = document.querySelector('.avatar');
    let goal = document.querySelector('.current-goal');
    let commitStreak = document.querySelector('.commit-streak');
    let commitsToday = document.querySelector('.commits-today');
    let highStreak = document.querySelector('.high-streak');

    username.textContent = data.username;
    avatar.src = data.avatar;
    goal.textContent = data.currentGoal;
    commitStreak.textContent = data.currentCommitStreakDays;
    commitsToday.textContent = data.commitsToday;
    highStreak.textContent = data.highStreak;
  }

  // Combines AJAX and render functions
  function getAndDisplayData(){
    getData(displayData);
  }

  // Makes the call
  getAndDisplayData();
}
