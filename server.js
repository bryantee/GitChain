'use static';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(express.static('build'));



app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});

module.exports = app;
