const admin = require("firebase-admin");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const register = [
  body("displayName").trim().notEmpty().withMessage("Display name is required"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: { message: "No token provided", code: "UNAUTHENTICATED" },
      });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      const existingUser = await User.findOne({ firebaseUid: decodedToken.uid });
      if (existingUser) {
        return res.status(200).json({ user: existingUser });
      }

      const userCount = await User.countDocuments();
      const role = userCount === 0 ? "admin" : "member";

      const user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: req.body.displayName,
        role,
      });

      return res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  },
];

const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, getMe };
