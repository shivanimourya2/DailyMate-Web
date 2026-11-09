const ApiError = require("../utils/ApiError");

// Runs when no route matched the request.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;