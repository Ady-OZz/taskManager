const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
} = require("../controllers/projectController");

router.get("/", authMiddleware, listProjects);
router.post("/", authMiddleware, roleMiddleware, createProject);
router.get("/:id", authMiddleware, getProject);
router.put("/:id", authMiddleware, roleMiddleware, updateProject);
router.delete("/:id", authMiddleware, roleMiddleware, deleteProject);
router.post("/:id/members", authMiddleware, roleMiddleware, addMember);
router.delete("/:id/members/:uid", authMiddleware, roleMiddleware, removeMember);
router.get("/:id/stats", authMiddleware, getProjectStats);

module.exports = router;
