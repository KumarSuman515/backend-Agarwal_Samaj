const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { connectDB, sequelize } = require("./config/db");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoute");
const candidateRoute = require("./routes/candidateRoute");
const classifiedRoutes = require("./routes/classifiedRoute"); // <-- Added classified routes import

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", adminRoutes);
app.use("/api/candidates", candidateRoute);
app.use("/api/classifieds", classifiedRoutes);  // <-- Register classified routes here

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Server is running!", 
    timestamp: new Date().toISOString(),
    database: "Connected"
  });
});

const PORT = process.env.PORT || 4005;

async function init() {
  try {
    await connectDB();

    // Sync database with force: false to preserve existing data
    await sequelize.sync({ force: false });
    console.log("Database synced successfully");

    app.listen(PORT, () => {
      console.log(`Express server started on http://localhost:${PORT}`);
      console.log(`Uploads directory: ${uploadsDir}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

init();
