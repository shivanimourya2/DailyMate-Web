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

const nodeEnv = process.env.NODE_ENV || "development";

// A short secret is easy to guess: refuse it in production, warn while developing.
if (process.env.JWT_SECRET.length < 32) {
  if (nodeEnv === "production") {
    console.error("JWT_SECRET must be at least 32 characters in production.");
    process.exit(1);
  }
  console.warn("Warning: JWT_SECRET is shorter than 32 characters. Use a longer one before deploying.");
}

module.exports = {
  nodeEnv,
  port: process.env.PORT || 5000,
  // CLIENT_URL can hold several addresses separated by commas.
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  trustProxy: process.env.TRUST_PROXY, // for example "1" behind a hosting proxy
};
