const path = require('path');
const express = require('express');
const helmet = require('helmet');
const forceSSL = require('express-force-ssl');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const backgroundImg = require('./middleware/backgroundImg');
const errorHandlers = require('./middleware/errHandlers');

const app = express();

// Viewzz
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Include our static assets
app.use(express.static(path.join(__dirname, 'public')));

// Support /.well-known (required for adding SSL with certbot)
app.use(express.static(path.join(__dirname, '.well-known')));

// Always wear a helmet
app.use(helmet());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Redirect all http request to https
app.set('forceSSLOptions', {
  httpsPort: process.env.PORT
});

app.use(forceSSL);

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
app.use(csrf({cookie: false}));

// Middleware for adding standard functions for template use
app.use((req, res, next) => {
  res.locals.token = req.csrfToken();
  next();
});

// Grab a background image for our app
app.use(backgroundImg);

// Include our custom routes
app.use('/', routes);

// If no routes are matched throw a 404
app.use(errorHandlers.noRouteMatch);

app.use(errorHandlers.renderErrorPage);

module.exports = app;
