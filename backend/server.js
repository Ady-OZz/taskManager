require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const initializeFirebase = require("./config/firebase");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const activityRoutes = require("./routes/activity");

const app = express();

initializeFirebase();

app.use(helmet());
app.use(cors({
  origin: [
    "https://task-manager-xwlv.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Group API routes to mount them on both /api and / (foolproof for Vercel env vars)
const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/activity", activityRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found", code: "NOT_FOUND" } });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Only run app.listen when not in Vercel (Vercel uses serverless functions instead)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
