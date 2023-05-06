const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const api = require('./routes/api');
const app = express();

process.on('uncaughtException', (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log(err);
  console.log('UN HANDLED EXECPTION SHUTTING DOWN ......  ');
  process.exit(1);
});

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public ')));
app.use('/v1', api);
app.get('/*', (req, res) => {
  console.log('arrived');
  //anything not matched up match here
  res.sendFile(path.join(__dirname, '..', 'public ', 'index.html'));
});

process.on('unhandledRejection', (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log('UN HANDLED REJECTION SHUTTING DOWN ......  ');
  server.close(() => {
    process.exit(1);
  });
});
module.exports = app;
