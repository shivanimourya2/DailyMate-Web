const env = require("../config/env");
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && env.nodeEnv === "production"
        ? "Something went wrong"
        : err.message || "Something went wrong",
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;