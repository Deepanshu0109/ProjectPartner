const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // project name
    description: { type: String, required: true },
    reason: { type: String, required: true }, // personal, hackathon, academic etc.
    teammatesNeeded: { type: Number, required: true },
    requiredSkills: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
  