'use strict';

// look ma, no jQuery
document.addEventListener('DOMContentLoaded', e => {
  main();
  eventListeners();
});

// Object for all mock data during client mockup phase
// const MOCK_DATA = {
//   username: 'bryantee',
//   avatar: 'https://avatars.githubusercontent.com/u/10674447?v=3',
//   currentGoal: 'Finish mocking out API response for client.',
//   currentCommitStreakDays: 5,
//   commitsToday: 1,
//   highStreak: 15
// }

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
  let updateBtn = document.querySelector('#update-btn');
  let loginBtnSubmit = document.querySelector('#login-button');
  let signupBtnSubmit = document.querySelector('#signup-button');

  // Current goal box for editing
  let currentGoalText = document.querySelector('.current-goal');

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

  // signup submit event
  signupBtnSubmit.addEventListener('click', e => {
    e.preventDefault();
    console.log('Signup button clicked');
    let username = document.querySelector('#signup-username').value.trim();
    let password1 = document.querySelector('#signup-password-1').value.trim();
    let password2 = document.querySelector('#signup-password-2').value.trim();

    // TODO: Flash real message to user
    if (password1 !== password2) return console.log("Passwords don't match")

    fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password1
      }),
      headers: new Headers({ "Content-Type": "application/json"})
    }).then( response => {
      if (response.status === 201) {
        console.log(`User ${username} succesfully created`);
      }
    })
  });

  // login submit event
  loginBtnSubmit.addEventListener('click', e => {
    e.preventDefault();
    console.log('Login button clicked');
    let username = document.querySelector('#login-username').value;
    let password = document.querySelector('#login-password').value;
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: new Headers({ "Content-Type": "application/json"}),
      credentials: 'include'
    })
    .then( response => {
      if (response.status === 200) {
        console.log(`User ${username} logged in`);
        return response.json();
      }
    }).then( j => {
      console.log(j);
      if (j.redirect) window.location = j.redirectURL;
      // hide signup & login
      logInBtn.classList.add('hide');
      signUpBtn.classList.add('hide');
    });
  });

  // Update info button event
  updateBtn.addEventListener('click', e => {
    updateBtn.classList.add('is-loading');
    let username = window.location.pathname.split('/')[2];
    let url = '/user/update/' + username;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ username: username }),
      headers: new Headers({ "Content-Type": "application/json"})
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          main();
        };
        // remove loading animation
        updateBtn.classList.remove('is-loading');
      });
  });

  // Current goal editable and update sent to server
  currentGoalText.addEventListener('dblclick', function() {
    console.log('goal dbl clicked');
    this.setAttribute('contentEditable', true);
  });
  currentGoalText.addEventListener('blur', (function() {
    this.setAttribute('contentEditable', false);
    let newGoal = currentGoalText.textContent;
    console.log(`New Goal: ${newGoal}`);
    // Send to server
    let username = window.location.pathname.split('/')[2];
    let url = '/users/' + username + '/goal';
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ currentGoal: newGoal }),
      headers: new Headers({ "Content-Type": "application/json" })
    })
      .then( response => {
        return response.json();
      })
        .then( response => {
          currentGoalText.textContent = response.currentGoal;
        });
  }));

}

// Main function to call in "document ready"
function main() {
  console.log('Main called');

  // This is currently mocked up with timeout
  // But will be replaced with an AJAX call to backend once complete
  function getData(callback, username) {
    // setTimeout(function(){
    //   callback(MOCK_DATA)
    // }, 1000);
    let url = '/users/' + username;
    fetch(url)
      .then(response => {
        return response.json();
      }).then( response => {
        callback(response);
      });

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
    let username = window.location.pathname.split('/')[2];
    getData(displayData, username);
  }

  // Makes the call
  getAndDisplayData();
}
