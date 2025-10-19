const Activity = require('../models/Activity');
const mongoose = require('mongoose');

const logActivity = async (userId, message, project = null) => {
  try {
    if (!userId || !message) return;

    // Use existing ObjectId if it's already an ObjectId
    const userObjectId =
      userId instanceof mongoose.Types.ObjectId
        ? userId
        : new mongoose.Types.ObjectId(userId);

    await Activity.create({
      user: userObjectId,
      action: message,
      project: project?._id || null,
      projectName: project?.name || null,
    });
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};

module.exports = logActivity;
