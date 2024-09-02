const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const feedelegationRouter = require('../routes/feedelegation');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'https://kaia-gas-abstraction-site.vercel.app/'
}))

app.use('/api/feedelegation', feedelegationRouter);

app.use(function(req, res, next) {
  res.status(404).json({success: false, message: 'API not found'});
});

module.exports = app;
