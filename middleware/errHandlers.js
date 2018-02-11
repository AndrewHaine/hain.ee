/*
  Middleware to handle all errors
*/

exports.catchErr = (func) => {
  return function(req, res, next) {
    return func(req, res, next).catch(next);
  };
};

exports.noRouteMatch = (req, res, next) => {
  const notFound = new Error('It looks like you\'ve found a url that doesn\'t exist yet, shorten some more URLs, go on - you know you want to');
  notFound.status = 404;
  next(notFound);
};

exports.renderErrorPage = (err, req, res, next) => {
  res.status(err.status || 500); // Use the given error status, else assume some other server error
  res.render('errorPage', {
    status: err.status || 500,
    errMessage: err.message
  });
};