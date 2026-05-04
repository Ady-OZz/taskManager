const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { register, getMe } = require("../controllers/authController");

router.post("/register", register);
router.get("/me", authMiddleware, getMe);

module.exports = router;
