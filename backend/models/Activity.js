// backend/models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g. 'Created Project', 'Deleted Project', etc.
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    projectName: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
