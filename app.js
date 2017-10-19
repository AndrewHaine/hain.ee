const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const helpers = require('./helpers/helpers');
const backgroundImg = require('./middleware/backgroundImg');

const app = express();

// Viewzz
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Include our static assets
app.use(express.static(path.join(__dirname, 'public')));

// Always wear a helmet
app.use(helmet());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Sessions
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {}
}));

// Cookies 🍪
app.use(cookieParser());

// CSRF protection on forms
app.use(csrf({cookie: false})); // Turned off for now

// Middleware for adding standard functions for template use
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.token = req.csrfToken();
  next();
});

// Grab a background image for our app
app.use(backgroundImg);

// Include our custom routes
app.use('/', routes);

module.exports = app;
