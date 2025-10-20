const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Models
const Message = require("./models/Message"); // ✅ add
const User = require("./models/User");       // needed to populate sender

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/requests", require("./routes/requestsRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("✅ ProjectPartner API is running...");
});

// ==========================
// Socket.IO setup with persistence
// ==========================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // replace "*" with frontend URL in production
});

io.on("connection", (socket) => {
  console.log("✅ New user connected:", socket.id);

  // Join project room
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  // Send message and save to DB
  socket.on("sendMessage", async ({ projectId, senderId, message }) => {
    try {
      if (!message || !senderId || !projectId) return;

      // Save message in MongoDB
      const msg = await Message.create({
        project: projectId,
        sender: senderId,
        text: message,
      });

      // Populate sender name for broadcasting
      const populatedMsg = await msg.populate("sender", "name");

      // Emit to all in project room
      io.to(projectId).emit("receiveMessage", {
        _id: populatedMsg._id,
        user: populatedMsg.sender.name,
        text: populatedMsg.text,
        timestamp: populatedMsg.createdAt,
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ==========================
// Start server
// ==========================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server + Socket.IO running on port ${PORT}`)
);
