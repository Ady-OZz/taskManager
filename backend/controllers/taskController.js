const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");

const listTasks = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.project) {
      filter.project = req.query.project;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "displayName email")
      .populate("createdBy", "displayName email")
      .populate("project", "name")
      .sort({ [sortField]: sortOrder });

    return res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("status")
    .optional()
    .isIn(["todo", "in_progress", "done"])
    .withMessage("Status must be todo, in_progress, or done"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("dueDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),
  body("project").notEmpty().withMessage("Project is required"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    try {
      const project = await Project.findById(req.body.project);
      if (!project) {
        return res.status(404).json({
          error: { message: "Project not found", code: "NOT_FOUND" },
        });
      }

      const taskData = {
        title: req.body.title,
        description: req.body.description || "",
        project: req.body.project,
        createdBy: req.user._id,
        status: req.body.status || "todo",
        priority: req.body.priority || "medium",
        dueDate: req.body.dueDate || null,
      };

      if (req.body.assignedTo) {
        const assignee = await User.findById(req.body.assignedTo);
        if (!assignee) {
          return res.status(404).json({
            error: { message: "Assignee not found", code: "NOT_FOUND" },
          });
        }
        taskData.assignedTo = assignee._id;
      }

      const task = await Task.create(taskData);

      await logActivity(
        `Created task '${task.title}' in project '${project.name}'`,
        req.user._id,
        project._id,
        task._id
      );

      if (taskData.assignedTo) {
        const assignee = await User.findById(taskData.assignedTo);
        if (assignee) {
          await logActivity(
            `Assigned '${task.title}' to ${assignee.displayName}`,
            req.user._id,
            project._id,
            task._id
          );
        }
      }

      const populated = await Task.findById(task._id)
        .populate("assignedTo", "displayName email")
        .populate("createdBy", "displayName email")
        .populate("project", "name");

      return res.status(201).json({ task: populated });
    } catch (err) {
      next(err);
    }
  },
];

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "displayName email")
      .populate("createdBy", "displayName email")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({
        error: { message: "Task not found", code: "NOT_FOUND" },
      });
    }

    return res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = [
  body("status")
    .optional()
    .isIn(["todo", "in_progress", "done"])
    .withMessage("Status must be todo, in_progress, or done"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("dueDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({
          error: { message: "Task not found", code: "NOT_FOUND" },
        });
      }

      const project = await Project.findById(task.project);

      if (req.user.role === "admin") {
        if (req.body.title !== undefined) task.title = req.body.title;
        if (req.body.description !== undefined) task.description = req.body.description;
        if (req.body.priority !== undefined) task.priority = req.body.priority;
        if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;

        if (req.body.assignedTo !== undefined) {
          const oldAssignee = task.assignedTo;
          task.assignedTo = req.body.assignedTo || null;

          if (req.body.assignedTo && (!oldAssignee || !oldAssignee.equals(req.body.assignedTo))) {
            const assignee = await User.findById(req.body.assignedTo);
            if (assignee) {
              await logActivity(
                `Assigned '${task.title}' to ${assignee.displayName}`,
                req.user._id,
                task.project,
                task._id
              );
            }
          }
        }
      }

      if (req.body.status !== undefined && req.body.status !== task.status) {
        const oldStatus = task.status;
        task.status = req.body.status;

        const statusLabels = { todo: "Todo", in_progress: "In Progress", done: "Done" };
        await logActivity(
          `Moved '${task.title}' to ${statusLabels[req.body.status]}`,
          req.user._id,
          task.project,
          task._id
        );
      }

      await task.save();

      const populated = await Task.findById(task._id)
        .populate("assignedTo", "displayName email")
        .populate("createdBy", "displayName email")
        .populate("project", "name");

      return res.status(200).json({ task: populated });
    } catch (err) {
      next(err);
    }
  },
];

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: { message: "Task not found", code: "NOT_FOUND" },
      });
    }

    const taskTitle = task.title;
    const projectId = task.project;

    await Task.findByIdAndDelete(task._id);

    await logActivity(
      `Deleted task '${taskTitle}'`,
      req.user._id,
      projectId,
      task._id
    );

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { listTasks, createTask, getTask, updateTask, deleteTask };
