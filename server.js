const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var dotenv = require('dotenv').config();

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// logger middleware
app.use(logger('dev'));
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


/**
 * Connect MongoDB
 */
const uri = process.env.DB_HOST;
const options = {
  useMongoClient: true
}
mongoose.connect(uri, options, function (err) {
  if (err) {
    console.log("Not connected to database: " + err);
  } else {
    console.log("Successfully connected to MongoDB");
  }
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server running on localhost:${port}`));
