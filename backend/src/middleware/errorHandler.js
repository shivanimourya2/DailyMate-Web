const env = require("../config/env");

// Express knows this is an error handler because it has 4 parameters.
// Every error in the app ends up here and leaves as the same JSON shape.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body is too large";
  } else if (err.code === 11000) {
    // Duplicate value in a unique field
    const field = Object.keys(err.keyPattern || {})[0];
    statusCode = 409;
    message = field === "email" ? "Email is already registered" : `${field || "Value"} already exists`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Not authorized, token invalid or expired";
  }

  if (statusCode === 500) {
    console.error(err);
    // Never leak internal details to clients in production.
    if (env.nodeEnv === "production") message = "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // The stack trace helps while developing, so it is hidden in production.
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
