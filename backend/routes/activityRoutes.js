const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const logActivity = require("../utils/logActivity");

// ============================
// Create a join request (Application)
// ============================
router.post("/", protect, async (req, res) => {
  try {
    const { projectId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Prevent duplicate requests
    const existing = await Application.findOne({ projectId, applicantId: req.user._id });
    if (existing) return res.status(400).json({ message: "You have already requested to join this project." });

    const application = await Application.create({
      projectId,
      applicantId: req.user._id,
      message,
      status: "Pending"
    });

    // Log activity
    await logActivity(req.user._id, `Applied to project "${project.name}"`, project);
    await logActivity(project.createdBy, `Received a join request for "${project.name}"`, project);

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// Get all request updates for logged-in user
// ============================
router.get("/request-logs", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("project", "name"); // optional if you store project reference

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching request logs" });
  }
});

module.exports = router;
