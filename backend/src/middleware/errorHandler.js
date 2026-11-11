const env = require("../config/env");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.code === 11000) {
    statusCode = 409;
    message = "Email is already registered";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id";
  }

  if (statusCode === 500) {
    console.error(err);
    if (env.nodeEnv === "production") message = "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;