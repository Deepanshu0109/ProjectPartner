const Application = require('../models/Application');
const Project = require('../models/Project');
const logActivity = require('../utils/logActivity');

// Apply to a project
const applyToProject = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Create application
    const application = await Application.create({
      projectId,
      applicantId: req.user._id,
      message
    });

    // Log applicant activity
    await logActivity(req.user._id, `Applied to project`, project);

    // Log creator notification
    await logActivity(project.createdBy, `Received a join request for your project`, project);

    res.status(201).json(application);
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get applications for a specific project (only creator can view)
const getApplicationsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ projectId }).populate('applicantId', 'name email');
    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Accept or reject application
// Accept or reject application
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // should be "Accepted" or "Rejected"
    const application = await Application.findById(req.params.id)
      .populate('projectId')
      .populate('applicantId', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    const project = application.projectId;

    // Only creator can accept/reject
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update status
    application.status = status;
    await application.save();

    // ✅ If accepted, add to project members
    if (status === "Accepted" && !project.members.includes(application.applicantId._id)) {
      project.members.push(application.applicantId._id);
      await project.save();
    }

    // 🧠 Log meaningful activity messages
    const creatorName = req.user.name || "Project Owner";
    const applicantName = application.applicantId.name;
    const projectName = project.name;

    // For creator
    await logActivity(
      req.user._id,
      `You ${status.toLowerCase()} ${applicantName}'s request for project "${projectName}"`,
      project
    );

    // For applicant
    await logActivity(
      application.applicantId._id,
      `${creatorName} ${status.toLowerCase()} your request to join "${projectName}"`,
      project
    );

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToProject, getApplicationsForProject, updateApplicationStatus };
