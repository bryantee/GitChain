'use static';

const express = require('express');

const app = express();
app.use(express.static('build'));



app.listen(process.env.port || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}`);
});
