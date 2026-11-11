const mongoose = require("mongoose");

const PRIORITIES = ["low", "medium", "high"];

const reminderSchema = new mongoose.Schema(
  {
    // The owner. Every query filters by this so users only see their own data.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be longer than 500 characters"],
      default: "",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: "Priority must be low, medium or high" },
      default: "medium",
    },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
module.exports.PRIORITIES = PRIORITIES;