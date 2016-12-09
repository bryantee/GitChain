# GitChain

[![Build Status](https://travis-ci.org/bryantee/GitChain.svg?branch=master)](https://travis-ci.org/bryantee/GitChain)

## Introduction

GitChain is inspired by the real life model that comedian Jerry Seinfeld used to motivate himself to write jokes. He committed himself to writing jokes each and every day, and additionally marking a large calendar with a big X for each day that he wrote. He called this building your chain and the only thing you had to do was not break it.

This is a programmer's take on building the chain. It monitors a user's GitHub account for commits each day. For each day you make at least one public commit, your streak increases. If you miss a day, the streak starts over.

*Code. Commit. Build your chain.*

## Documentation

You will need to use your GitHub username when you sign up for this to work. But don't worry, you can select any random throw away password as this will not be authenticating with GitHub, but rather consuming from the public API. Each day, at the end of the day, GitChain will automagically check to see if you have commits. If you'd like, you can visit at any point in time during the day and run the update which will fetch up-to-date commit data for your account and store it in the GC database. That's it!

## Packages and Other Tech used

- Node.js
- Express
- MongoDB / Mongoose
- Bcrypt.js
- Passport.js
- Moment.js
- [github_simplestat](https://www.npmjs.com/package/github_simplestat)
- Request
- bodyParser
- And a few other awesome 3rd party Packages on the backend

The front end is written in plain vanilla JS with no frameworks or libraries. I'm using [Bulma.io](http://bulma.io/), an awesome CSS framework based on Flexbox for styling and layout. It's being hosted on Heroku and my db is hosted on [mLab](https://mlab.com/).
