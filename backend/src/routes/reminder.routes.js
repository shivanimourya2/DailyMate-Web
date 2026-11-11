const express = require("express");
const protect = require("../middleware/auth");
const ApiError = require("../utils/ApiError");
const {
  createReminder,
  getReminders,
  getReminder,
  updateReminder,
  completeReminder,
  deleteReminder,
} = require("../controllers/reminder.controller");

const router = express.Router();

// Every reminder route needs a logged-in user.
router.use(protect);

// Runs automatically for any route containing :id, so we check it only once.
router.param("id", (req, res, next, id) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new ApiError(400, "Invalid reminder id");
  }
  next();
});

router.route("/").post(createReminder).get(getReminders);
router.route("/:id").get(getReminder).put(updateReminder).delete(deleteReminder);
router.patch("/:id/complete", completeReminder);

module.exports = router;