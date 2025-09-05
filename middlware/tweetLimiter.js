const rateLimit = require("express-rate-limit");

// Example: 8 requests per minute per IP
const tweetLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 8,                   // max 8 requests per IP
  message: "Too many Twitter requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { tweetLimiter };
