const { body, validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");

const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    })
      .populate("createdBy", "displayName email")
      .populate("members", "displayName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects });
  } catch (err) {
    next(err);
  }
};

const createProject = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3 })
    .withMessage("Project name must be at least 3 characters"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    try {
      const project = await Project.create({
        name: req.body.name,
        description: req.body.description || "",
        createdBy: req.user._id,
        members: [req.user._id],
      });

      await logActivity(
        `Created project '${project.name}'`,
        req.user._id,
        project._id
      );

      const populated = await Project.findById(project._id)
        .populate("createdBy", "displayName email")
        .populate("members", "displayName email");

      return res.status(201).json({ project: populated });
    } catch (err) {
      next(err);
    }
  },
];

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "displayName email")
      .populate("members", "displayName email");

    if (!project) {
      return res.status(404).json({
        error: { message: "Project not found", code: "NOT_FOUND" },
      });
    }

    const isMember =
      project.members.some((m) => m._id.equals(req.user._id)) ||
      project.createdBy._id.equals(req.user._id);

    if (!isMember && req.user.role !== "admin") {
      return res.status(403).json({
        error: { message: "Access denied", code: "FORBIDDEN" },
      });
    }

    return res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
};

const updateProject = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Project name must be at least 3 characters"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({
          error: { message: "Project not found", code: "NOT_FOUND" },
        });
      }

      if (req.body.name !== undefined) project.name = req.body.name;
      if (req.body.description !== undefined) project.description = req.body.description;

      await project.save();

      const populated = await Project.findById(project._id)
        .populate("createdBy", "displayName email")
        .populate("members", "displayName email");

      return res.status(200).json({ project: populated });
    } catch (err) {
      next(err);
    }
  },
];

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        error: { message: "Project not found", code: "NOT_FOUND" },
      });
    }

    const projectName = project.name;
    const projectId = project._id;

    await Task.deleteMany({ project: projectId });
    await ActivityLog.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);

    await logActivity(
      `Deleted project '${projectName}'`,
      req.user._id,
      projectId
    );

    return res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        error: { message: "Project not found", code: "NOT_FOUND" },
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(422).json({
        errors: [{ field: "email", message: "Email is required" }],
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: { message: "User not found with that email", code: "NOT_FOUND" },
      });
    }

    if (project.members.some((m) => m.equals(user._id))) {
      return res.status(400).json({
        error: { message: "User is already a member", code: "ALREADY_MEMBER" },
      });
    }

    project.members.push(user._id);
    await project.save();

    await logActivity(
      `Added ${user.displayName} to project '${project.name}'`,
      req.user._id,
      project._id
    );

    const populated = await Project.findById(project._id)
      .populate("createdBy", "displayName email")
      .populate("members", "displayName email");

    return res.status(200).json({ project: populated });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        error: { message: "Project not found", code: "NOT_FOUND" },
      });
    }

    const user = await User.findById(req.params.uid);
    if (!user) {
      return res.status(404).json({
        error: { message: "User not found", code: "NOT_FOUND" },
      });
    }

    if (project.createdBy.equals(user._id)) {
      return res.status(400).json({
        error: { message: "Cannot remove the project creator", code: "CANNOT_REMOVE_CREATOR" },
      });
    }

    project.members = project.members.filter((m) => !m.equals(user._id));
    await project.save();

    await logActivity(
      `Removed ${user.displayName} from project '${project.name}'`,
      req.user._id,
      project._id
    );

    const populated = await Project.findById(project._id)
      .populate("createdBy", "displayName email")
      .populate("members", "displayName email");

    return res.status(200).json({ project: populated });
  } catch (err) {
    next(err);
  }
};

const getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        error: { message: "Project not found", code: "NOT_FOUND" },
      });
    }

    const tasks = await Task.find({ project: project._id });
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const completionPercent = total === 0 ? 0 : Math.round((done / total) * 100);

    return res.status(200).json({
      total,
      todo,
      in_progress: inProgress,
      done,
      completionPercent,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
};
