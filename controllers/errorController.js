const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  // console.log(err);
  const errors = Object.values(err.errors).map(el => el.message);
  // console.log(errors);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // B) RENDERED WEBSITE
  console.error('ERROR 💣', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredToken = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Optional, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programing or other unknown error: dont leak error details
    // 1) Log error
    console.error('ERROR 💣', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
  // B) RENDERED WEBSITE
  // a) Optional, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // b) Programing or other unknown error: dont leak error details
  // 1) Log error
  console.error('ERROR 💣', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // BUG ZA MUJKETA (error.name === 'ValidationError')
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredToken();

    sendErrorProd(error, req, res);
  }
};
