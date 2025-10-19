const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");

// GET all pending requests for projects the user owns
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all projects created by the logged-in user
    const projects = await Project.find({ createdBy: userId }).populate("requests", "name email");

    // Map into a format suitable for frontend
    const pendingRequests = [];

    projects.forEach((project) => {
      project.requests.forEach((requester) => {
        pendingRequests.push({
          projectId: project._id,
          projectName: project.name,
          senderId: requester._id,
          senderName: requester.name,
          senderEmail: requester.email,
        });
      });
    });

    res.json(pendingRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching requests" });
  }
});

module.exports = router;
