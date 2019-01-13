const path = require("path");
const express = require("express");
const helmet = require("helmet");
const forceSSL = require("express-force-ssl");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const serveIndex = require("serve-index");
const routes = require("./routes/index");
const randomimg = require("./middleware/randomimg");
const errorHandlers = require("./middleware/errHandlers");

const app = express();

// Viewzz
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Include our static assets
app.use(express.static(path.join(__dirname, "public")));

// Support /.well-known (required for adding SSL with certbot)
app.use(
  "/.well-known",
  express.static(path.join(__dirname, ".well-known")),
  serveIndex(".well-known")
);

// Always wear a helmet
app.use(
  helmet({
    hidePoweredBy: false
  })
);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {}
  })
);

// Cookies 🍪
app.use(cookieParser());

// CSRF protection on forms
app.use(csrf({ cookie: false }));

// Middleware for adding standard functions for template use
app.use((req, res, next) => {
  res.locals.token = req.csrfToken();
  res.locals.gaTrackingID = process.env.GA_TRACKING_CODE;
  next();
});

// Grab a background image for our app
app.use(
  randomimg({
    unsplashID: process.env.UNSPLASH_APPID,
    unsplashUTM: process.env.UNSPLASH_UTM
  })
);

// Include our custom routes
app.use("/", routes);

// If no routes are matched throw a 404
app.use(errorHandlers.noRouteMatch);

app.use(errorHandlers.renderErrorPage);

module.exports = app;
