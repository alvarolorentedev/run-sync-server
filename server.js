const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('pino')({
  enabled: process.env.NODE_ENV !== 'test'
});
const app = express();

app.use(helmet());
app.use(bodyParser.json());

// Need to set Mongoose Promise to default promise now...
// https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('DB connection error', err);
});
db.once('open', () => {
  logger.info('DB connection opened');
});
mongoose.connect((`mongodb://${config.MONGO_HOST}/${config.MONGO_DB}`));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});


// app.use('/accounts', require('./src/accounts/router'));
app.use('/api/users', require('./src/users/router'));
app.use('/api/nike', require('./src/nike/router'));
app.use('/api/', require('./src/home/router'));
// app.get('/status', require('./src/status'));
app.all('/api/*', require('./src/missing'));

app.use((err, req, res, next) => { //eslint-disable-line no-unused-vars
  logger.error(err);
  return res.status(500).json({
    error: 'Internal Server Error'
  });
});

module.exports = app;
