require("dotenv").config();
const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db");

const app = express();
app.use(express.json());

// Serve static files (images) from email/template/img directory
app.use("/images", express.static(path.join(__dirname, "email/template/img")));

connectDB().then(() => {
  console.log("MongoDB Ready");
});

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "Bulk Email Firing API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", require("./routes/emailRoutes"));

// Start the worker
require("./worker/emailWorker");

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
