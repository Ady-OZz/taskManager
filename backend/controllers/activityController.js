const ActivityLog = require("../models/ActivityLog");
const Project = require("../models/Project");

const getActivityLogs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.project) {
      filter.project = req.query.project;
    } else {
      const userProjects = await Project.find({
        $or: [{ createdBy: req.user._id }, { members: req.user._id }],
      }).select("_id");

      const projectIds = userProjects.map((p) => p._id);
      filter.project = { $in: projectIds };
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 50);

    const logs = await ActivityLog.find(filter)
      .populate("performedBy", "displayName email")
      .populate("project", "name")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ logs });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActivityLogs };
