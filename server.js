const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// -------------------- MIDDLEWARE --------------------
app.use(express.json()); // Parse JSON

// Rate limiter (100 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173", // Local dev frontend
    "https://video-downloads-frontend.vercel.app" // Deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Optional: log all incoming requests
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// -------------------- ROUTES --------------------

// Test YouTube download route
app.post('/api/v1/youtubepost', (req, res) => {
  if (!req.body.url) return res.status(400).json({ success: false, message: "URL is required" });
  
  console.log("Received URL:", req.body.url);
  res.json({ success: true, url: req.body.url });
});

// Static downloads folder
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

// Example index route
app.get('/', (req, res) => res.send("Backend is running!"));

// -------------------- START SERVER --------------------
app.listen(port, () => console.log(`Backend running on port ${port}`));
