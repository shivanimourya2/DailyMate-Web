const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  } catch (error) {
    throw new ApiError(401, "Not authorized, token invalid or expired");
  }

  const user = typeof decoded.id === "string" ? await User.findById(decoded.id) : null;
  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists");
  }

  req.user = user; // available in the next handlers
  next();
};

module.exports = protect;
