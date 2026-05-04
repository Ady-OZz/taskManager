const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const updateRole = [
  body("role")
    .isIn(["admin", "member"])
    .withMessage("Role must be 'admin' or 'member'"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          error: { message: "User not found", code: "NOT_FOUND" },
        });
      }

      user.role = req.body.role;
      await user.save();

      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  },
];

module.exports = { listUsers, updateRole };
