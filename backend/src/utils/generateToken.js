const jwt = require("jsonwebtoken");
const env = require("../config/env");

// Creates a signed token that stores the user's id.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

module.exports = generateToken;