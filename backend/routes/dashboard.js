const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Application = require("../models/Application");
const Feedback = require("../models/Feedback");
const Activity = require("../models/Activity");
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/dashboard
// @desc    Get user dashboard stats & recent activity
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      projectCount,
      requestCount,
      messageCount,
      recentProjects,
      recentActivity,
    ] = await Promise.all([
      Project.countDocuments({ $or: [{ createdBy: userId }, { members: userId }] }),

      Project.aggregate([
        { $match: { createdBy: userId } },
        { $project: { numRequests: { $size: "$requests" } } },
        { $group: { _id: null, total: { $sum: "$numRequests" } } },
      ]).then((res) => res[0]?.total || 0),

      Feedback.countDocuments({ user: userId }),

      Project.find({ $or: [{ createdBy: userId }, { members: userId }] })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name createdAt"),

      // ✅ Fetch activity logs
      Activity.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      stats: {
        projects: projectCount,
        requests: requestCount,
        messages: messageCount,
      },
      recentProjects,
      activity: recentActivity,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
