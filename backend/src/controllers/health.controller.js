const mongoose = require("mongoose");

const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];

// Handles GET /api/health
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "DailyMate API is running",
    database: dbStates[mongoose.connection.readyState] || "unknown",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };