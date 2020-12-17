const AppError = require('../util/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateDataErrorDB = () => {
  const message = 'Email already exist.';

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const arrErrors = [];

  for (let e in err.errors) arrErrors.push(err.errors[e].message);

  const message = `${arrErrors.join('.\n')}`;

  return new AppError(message, 400);
};

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodError = (err, res) => {
  // predicted errors, trusted errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('Error', err);
  res.status(500).json({
    status: 'error',
    message: "Something went wrong! We're working on it!",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDataErrorDB();
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    prodError(error, res);
  }
};
