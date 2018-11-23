const errorHandler = function(err, req, res, next) {
  let errCode, errMessage;

  if (err.errors) {
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('application/json')
    .json({error: errMessage});
};

module.exports = errorHandler;