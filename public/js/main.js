'use strict';

// look ma, no jQuery
// Just setup some basic event listeners in 'document.ready()'
// main() is called to pull in data and render to profile page
document.addEventListener('DOMContentLoaded', e => {
  eventListeners();
});

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
  let hamburger = document.querySelector('.nav-toggle')

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

    // hit endpoint with logout
    fetch('/logout', {});
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

  // mobile nav toggle
  hamburger.addEventListener('click', () => {
    let nav = document.querySelector('.nav-menu');
    nav.classList.toggle('is-active');
  });

  // signup submit event
  signupBtnSubmit.addEventListener('click', e => {
    e.preventDefault();
    let username = document.querySelector('#signup-username').value.trim();
    let password1 = document.querySelector('#signup-password-1').value.trim();
    let password2 = document.querySelector('#signup-password-2').value.trim();

    // TODO: Flash real message to user
    if (password1 !== password2) {
      let passwords = document.querySelectorAll('.password-input');
      passwords.forEach( input => {
        input.classList.add('is-danger');
      });
      document.querySelector('.help').classList.remove('hide');
    }

    fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password1
      }),
      headers: new Headers({ "Content-Type": "application/json"})
    }).then( response => {
      if (response.status === 201) {
        resetViews();
        logInView.classList.remove('hide');
        logInView.classList.add('show');
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
        return response.json();
      }
    }).then( j => {
      console.log(j);
      // call main render function
      main(username);
      resetTabs()
      logInBtn.classList.add('hide');
      signUpBtn.classList.add('hide');
      profileBtn.classList.add('is-active');
      profileBtn.classList.remove('hide');

      // take to profile view
      profileBtn.classList.remove('hide');
      resetViews();
      profileView.classList.remove('hide');
      profileView.classList.add('show');
      logoutBtn.classList.remove('hide');
      logoutBtn.classList.add('show');

      // feature detection for mobile view
      let editSelect = ('ontouchstart' in window) ? 'click' : 'dblclick';

      // Current goal editable and update sent to server
      currentGoalText.addEventListener(editSelect, function() {
        this.setAttribute('contentEditable', true);
      });
      currentGoalText.addEventListener('blur', (function() {
        this.setAttribute('contentEditable', false);
        let newGoal = currentGoalText.textContent;
        // Send to server
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

      // Update info button event
      updateBtn.addEventListener('click', e => {
        updateBtn.classList.add('is-loading');
        let url = '/user/update/' + username;
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({ username: username }),
          headers: new Headers({ "Content-Type": "application/json"})
        })
          .then(response => {
            if (response.status === 200) {
              main(username);
            };
            // remove loading animation
            updateBtn.classList.remove('is-loading');
          });
      });

    });
  });
}

// Main function to call in "document ready"
function main(username) {

  // Gets data from backend for authenticated user
  function getData(callback, username) {
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
    let username = document.querySelector('.username');
    let avatar = document.querySelector('.avatar');
    let goal = document.querySelector('.current-goal');
    let commitStreak = document.querySelector('.commit-streak');
    let commitsToday = document.querySelector('.commits-today');
    let highStreak = document.querySelector('.high-streak');
    let bio = document.querySelector('.bio');
    let location = document.querySelector('.location');
    // TODO: use URL to make it easy to get to user GH page

    username.textContent = data.username;
    avatar.src = data.avatar;
    goal.textContent = data.currentGoal;
    commitStreak.textContent = data.currentCommitStreakDays;
    commitsToday.textContent = data.commitsToday;
    highStreak.textContent = data.highStreak;
    bio.textContent = data.bio;
    location.textContent = data.location;
  }

  // Combines AJAX and render functions
  function getAndDisplayData(username){
    getData(displayData, username);
  }

  // Makes the call
  getAndDisplayData(username);
}
