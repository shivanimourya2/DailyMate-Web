const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const reminderRoutes = require("./reminder.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/reminders", reminderRoutes)

module.exports = router;