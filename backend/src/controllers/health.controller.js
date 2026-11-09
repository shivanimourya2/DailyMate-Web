const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "DailyMate API is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };