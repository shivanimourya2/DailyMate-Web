// Loads the .env file and exports all settings from one place.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Stop early with a clear message instead of failing later in a confusing way.
["MONGO_URI", "JWT_SECRET"].forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing ${name}. Add it to backend/.env (see .env.example).`);
    process.exit(1);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};