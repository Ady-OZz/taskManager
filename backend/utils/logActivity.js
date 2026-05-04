const ActivityLog = require("../models/ActivityLog");

const logActivity = async (action, performedBy, projectId, taskId = null) => {
  try {
    await ActivityLog.create({
      action,
      performedBy,
      project: projectId,
      task: taskId,
    });
  } catch (err) {
    // Never throw — log failures must not break main operations
  }
};

module.exports = logActivity;
