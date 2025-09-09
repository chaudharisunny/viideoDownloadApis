require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 10000;

// Routes
const indexRoutes = require('./routes/index'); // make sure to import your download routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional for form data
app.use(cors());

// Rate limiter (global, can customize per route)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // max 60 requests per minute
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// Static folder for downloaded files
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

// API routes
app.use('/api/v1', indexRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running ✅" });
});

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}!`));
