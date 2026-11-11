const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

// Only these fields are ever sent back. The password never is.
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

// Makes sure every value is a non-empty string (blocks odd inputs like objects).
const allStrings = (...values) =>
  values.every((v) => typeof v === "string" && v.trim() !== "");

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!allStrings(name, email, password)) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    token: generateToken(user._id),
    user: userResponse(user),
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!allStrings(email, password)) {
    throw new ApiError(400, "Email and password are required");
  }

  // select("+password") because the password is hidden by default
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  // Same message for both cases so attackers can't tell which one was wrong.
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token: generateToken(user._id),
    user: userResponse(user),
  });
};

// GET /api/auth/me  (protected)
const getMe = (req, res) => {
  res.status(200).json({ success: true, user: userResponse(req.user) });
};

module.exports = { register, login, getMe };