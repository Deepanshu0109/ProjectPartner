const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");
const logActivity = require("../utils/logActivity");

// Accept application
router.post("/:id/accept", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("project").populate("applicant");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const project = application.project;
    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = "Accepted";
    await application.save();

    // Add user to project's members
    project.members.push(application.applicant._id);
    await project.save();

    // Log activities
    await logActivity(
      application.applicant._id,
      `Your request to join "${project.name}" was accepted.`,
      project
    );

    await logActivity(
      req.user.id,
      `You accepted ${application.applicant.name}'s request to join "${project.name}".`,
      project
    );

    res.json({ message: "Application accepted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject application
router.post("/:id/reject", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("project").populate("applicant");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const project = application.project;
    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = "Rejected";
    await application.save();

    // Log activities
    await logActivity(
      application.applicant._id,
      `Your request to join "${project.name}" was rejected.`,
      project
    );

    await logActivity(
      req.user.id,
      `You rejected ${application.applicant.name}'s request to join "${project.name}".`,
      project
    );

    res.json({ message: "Application rejected successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
