const errorHandler = function(err, req, res, next) {
  const errorCode = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';
  res.status(errorCode).type('application/json')
    .json({error: errorMessage});
};

module.exports = errorHandler;