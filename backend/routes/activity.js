const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getActivityLogs } = require("../controllers/activityController");

router.get("/", authMiddleware, getActivityLogs);

module.exports = router;
