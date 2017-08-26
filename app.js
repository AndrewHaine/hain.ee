const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const helpers = require('./helpers/helpers');

const app = express();

// Viewzz
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Include our static assets
app.use(express.static(path.join(__dirname, 'public')));

// Cookies 🍪
app.use(cookieParser());

// CSRF protection on forms
app.use(csrf({cookie: true}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Middleware for adding standard functions for template use
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

// Include our custom routes
app.use('/', routes);

module.exports = app;
