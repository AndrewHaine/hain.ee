/*
  Middleware to handle all errors
*/

exports.catchErr = (func) => {
  return function(req, res, next) {
    return func(req, res, next).catch(next);
  };
};
