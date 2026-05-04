const admin = require("firebase-admin");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: { message: "No token provided", code: "UNAUTHENTICATED" },
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({
        error: { message: "User not found in database", code: "USER_NOT_FOUND" },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { message: "Invalid or expired token", code: "INVALID_TOKEN" },
    });
  }
};

module.exports = authMiddleware;
