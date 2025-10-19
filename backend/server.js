const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

const requestsRoutes = require("./routes/requestsRoutes");
app.use("/api/requests", requestsRoutes);

const activityRoutes = require("./routes/activityRoutes");
app.use("/api/activity", require("./routes/activityRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("✅ ProjectPartner API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
console.log("✅ User model loaded");

