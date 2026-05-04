const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { listUsers, updateRole } = require("../controllers/userController");

router.get("/", authMiddleware, roleMiddleware, listUsers);
router.put("/:id/role", authMiddleware, roleMiddleware, updateRole);

module.exports = router;
