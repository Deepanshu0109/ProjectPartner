const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");
const mongoose = require("mongoose");
const router = express.Router();


// ==========================
// CREATE project
// ==========================
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, reason, teammatesNeeded, requiredSkills } = req.body;

    const project = await Project.create({
      name,
      description,
      reason,
      teammatesNeeded,
      requiredSkills,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});

// ==========================
// GET all projects
// ==========================
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});
// ============================
// Get all current teams (projects user is in)
// ============================
router.get("/current-teams", protect, async (req, res) => {
  try {
    // Find projects where the logged-in user is part of members[]
    const projects = await Project.find({ members: req.user._id })
      .populate("createdBy", "name email") // who created the project
      .populate("members", "name email")   // teammates info
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("Error fetching current teams:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================
// GET projects by logged-in user
// ==========================
router.get("/my-projects", protect, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

// ==========================
// GET pending requests for user's projects
// ==========================
router.get("/requests", protect, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).populate(
      "requests",
      "name email"
    );

    const requests = [];
    projects.forEach((project) => {
      project.requests.forEach((user) => {
        requests.push({
          projectId: project._id,
          projectName: project.name,
          senderId: user._id,
          senderName: user.name,
          senderEmail: user.email,
        });
      });
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

// ==========================
// JOIN a project
// ==========================
router.post("/:id/join", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.equals(req.user._id))
      return res.status(400).json({ message: "You are the owner of this project" });

    if (
      project.requests.some((id) => id.equals(req.user._id)) ||
      project.members.some((id) => id.equals(req.user._id))
    )
      return res.status(400).json({ message: "Already requested or already a member" });

    project.requests.push(req.user._id);
    await project.save();

    res.json({ message: "Request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending join request", error });
  }
});
// ==========================
// GET single project by ID
// ==========================
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("requests", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project); // just return project, frontend can handle it
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ==========================
// UPDATE project
// ==========================
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only creator can update
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, description, reason, teammatesNeeded, requiredSkills } = req.body;

    // Update fields if provided
    project.name = name ?? project.name;
    project.description = description ?? project.description;
    project.reason = reason ?? project.reason;
    project.teammatesNeeded = teammatesNeeded ?? project.teammatesNeeded;
    project.requiredSkills = requiredSkills ?? project.requiredSkills;

    await project.save();

    res.json({ project });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
});

// ==========================
// DELETE project
// ==========================
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
});
// ==========================
// ACCEPT a join request
// ==========================
router.post("/:id/accept/:userId", protect, async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const project = await Project.findById(projectId).populate("requests");
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.createdBy.equals(req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!project.requests.some((u) => u._id.equals(userObjectId)))
      return res.status(400).json({ message: "No such request" });

    // Move user to members
    project.requests = project.requests.filter((u) => !u._id.equals(userObjectId));
    project.members.push(userObjectId);
    await project.save();

    const responderName = req.user.name || req.user.email;
    await logActivity(
      userObjectId,
      `${responderName} has accepted your join request for project "${project.name}"`,
      project
    );

    res.json({ message: "User accepted as member" });
  } catch (error) {
    console.error("ACCEPT ERROR:", error);
    res.status(500).json({ message: "Error accepting request", error: error.message });
  }
});

// ==========================
// REJECT a join request
// ==========================
router.post("/:id/reject/:userId", protect, async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const project = await Project.findById(projectId).populate("requests");
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.createdBy.equals(req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!project.requests.some((u) => u._id.equals(userObjectId)))
      return res.status(400).json({ message: "No such request" });

    project.requests = project.requests.filter((u) => !u._id.equals(userObjectId));
    await project.save();

    const responderName = req.user.name || req.user.email;
    await logActivity(
      userObjectId,
      `${responderName} has rejected your join request for project "${project.name}"`,
      project
    );

    res.json({ message: "Request rejected" });
  } catch (error) {
    console.error("REJECT ERROR:", error);
    res.status(500).json({ message: "Error rejecting request", error: error.message });
  }
});




module.exports = router;
