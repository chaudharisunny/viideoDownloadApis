// middlware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const fbLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 8, // adjust as needed
  message: "Too many Facebook requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { fbLimiter };
