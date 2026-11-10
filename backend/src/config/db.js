
const dns = require("node:dns");

// Use public DNS servers to resolve MongoDB Atlas addresses.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const env = require("./env");

// Connects to MongoDB Atlas. Throws an error if it cannot connect.
const connectDB = async () => {
  const conn = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });

  // Log only the host, never the full URI.
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
