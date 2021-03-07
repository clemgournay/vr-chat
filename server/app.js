require('dotenv').load();

// Node/Express
const express = require('express');
const Sentry = require('@sentry/node');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session  = require('express-session');
const cors = require('cors');
const config = require('./src/config');
const passport = require('passport');

// Import Mongoose
let mongoose = require('mongoose');

// Create Express webapp
const app = express();

Sentry.init({ dsn: 'https://35f7a53c44274fd3a929e93bb16e68d5@o418506.ingest.sentry.io/5366504' });
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(config.APP_SECRET));
app.use(session({
  secret: config.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    SameSite: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.APP_DOMAIN);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

switch(config.ENV) {
  case 'local':
    mongoose.connect('mongodb+srv://clem:YukaMael0504$@cluster0.bkfz6.mongodb.net/vrchat?retryWrites=true&w=majority', {useNewUrlParser: true});
    break;
}

//
const db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

const router = require('./src/router');
app.use(router);


// Create http server and run it
const server = http.createServer(app);
const port = process.env.PORT || 3000;

require('./src/socket')(server);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

server.listen(port, function() {
  console.log('Express server running on *:' + port);
});


module.exports = app;