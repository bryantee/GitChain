'use static';

const express = require('express');

const app = express();
app.use(express.static('src'));



app.listen(process.env.port || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}`);
});

module.exports = app;
