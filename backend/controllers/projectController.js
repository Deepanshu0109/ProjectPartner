const Project = require("../models/Project");
const logActivity = require("../utils/logActivity");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description, requiredSkills } = req.body;

    const project = await Project.create({
      name,
      description,
      requiredSkills,
      createdBy: req.user._id,
    });

    // ✅ Log activity
    await logActivity(req.user._id, `Created project "${project.name}"`);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("createdBy", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project (only creator)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Project.deleteOne({ _id: project._id });

    // ✅ Log activity
    await logActivity(req.user._id, `Deleted project "${project.name}"`);

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createProject, getProjects, getProjectById, deleteProject };
