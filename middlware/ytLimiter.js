const rateLimit = require("express-rate-limit");

// Allow up to 10 requests per IP per minute
const Ytlimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // increase max requests
  message: "Too many requests. Please wait a minute.",
});

module.exports=Ytlimiter