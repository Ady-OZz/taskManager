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
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);

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
