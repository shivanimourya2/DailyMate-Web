const Reminder = require("../models/Reminder");
const { PRIORITIES } = require("../models/Reminder");
const ApiError = require("../utils/ApiError");

// Only these fields can be set by the client. This blocks sneaky fields
// like "user" or "isCompleted" from being sent in create/update requests.
const ALLOWED_FIELDS = ["title", "description", "dueDate", "priority"];

const pickFields = (body = {}) => {
  const data = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
};

// Checks the type and format of each field that was sent.
const validateFields = (data) => {
  if (data.title !== undefined && (typeof data.title !== "string" || !data.title.trim())) {
    throw new ApiError(400, "Title must be a non-empty text");
  }
  if (data.description !== undefined && typeof data.description !== "string") {
    throw new ApiError(400, "Description must be text");
  }
  if (data.dueDate !== undefined) {
    const okType = typeof data.dueDate === "string" || typeof data.dueDate === "number";
    if (!okType || Number.isNaN(new Date(data.dueDate).getTime())) {
      throw new ApiError(400, "Due date must be a valid date");
    }
  }
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) {
    throw new ApiError(400, `Priority must be one of: ${PRIORITIES.join(", ")}`);
  }
};

// POST /api/reminders
const createReminder = async (req, res) => {
  const data = pickFields(req.body);

  if (data.title === undefined || data.dueDate === undefined) {
    throw new ApiError(400, "Title and due date are required");
  }
  validateFields(data);

  const reminder = await Reminder.create({ ...data, user: req.user._id });

  res.status(201).json({ success: true, message: "Reminder created", reminder });
};

// GET /api/reminders?status=pending|completed|overdue&priority=high
const getReminders = async (req, res) => {
  const { status, priority } = req.query;
  const filter = { user: req.user._id };

  if (status !== undefined) {
    if (status === "completed") {
      filter.isCompleted = true;
    } else if (status === "pending") {
      filter.isCompleted = false;
    } else if (status === "overdue") {
      filter.isCompleted = false;
      filter.dueDate = { $lt: new Date() };
    } else {
      throw new ApiError(400, "Status must be pending, completed or overdue");
    }
  }

  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      throw new ApiError(400, `Priority must be one of: ${PRIORITIES.join(", ")}`);
    }
    filter.priority = priority;
  }

  const reminders = await Reminder.find(filter).sort({ dueDate: 1 }); // soonest first

  res.status(200).json({ success: true, count: reminders.length, reminders });
};

// GET /api/reminders/:id
const getReminder = async (req, res) => {
  // Searching by id AND owner means other users' reminders look like "not found".
  const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
  if (!reminder) throw new ApiError(404, "Reminder not found");

  res.status(200).json({ success: true, reminder });
};

// PUT /api/reminders/:id  (send only the fields you want to change)
const updateReminder = async (req, res) => {
  const data = pickFields(req.body);

  if (Object.keys(data).length === 0) {
    throw new ApiError(400, "Nothing to update. Send title, description, dueDate or priority");
  }
  validateFields(data);

  const reminder = await Reminder.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    data,
    { returnDocument: "after", runValidators: true } // return the updated document, check rules
  );
  if (!reminder) throw new ApiError(404, "Reminder not found");

  res.status(200).json({ success: true, message: "Reminder updated", reminder });
};

// PATCH /api/reminders/:id/complete  (body is optional: { "isCompleted": false } to undo)
const completeReminder = async (req, res) => {
  const isCompleted = req.body && req.body.isCompleted !== undefined ? req.body.isCompleted : true;

  if (typeof isCompleted !== "boolean") {
    throw new ApiError(400, "isCompleted must be true or false");
  }

  const reminder = await Reminder.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isCompleted, completedAt: isCompleted ? new Date() : null },
    { returnDocument: "after" }
  );
  if (!reminder) throw new ApiError(404, "Reminder not found");

  res.status(200).json({
    success: true,
    message: isCompleted ? "Reminder marked as completed" : "Reminder marked as pending",
    reminder,
  });
};

// DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!reminder) throw new ApiError(404, "Reminder not found");

  res.status(200).json({ success: true, message: "Reminder deleted" });
};

module.exports = {
  createReminder,
  getReminders,
  getReminder,
  updateReminder,
  completeReminder,
  deleteReminder,
};