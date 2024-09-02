const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const feedelegationRouter = require('../routes/feedelegation');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  'https://kaia-gas-abstraction-site.vercel.app',
  'http://localhost:3001'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use('/api/feedelegation', feedelegationRouter);

app.use(function(req, res, next) {
  res.status(404).json({success: false, message: 'API not found'});
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`API endpoint should be available at http://localhost:${port}/api/feedelegation`);
  });
}
