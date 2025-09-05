// middlware/facebookRequestWrapper.js
const { queueRequest } = require("./requestQueue");
const axios = require("axios");

// List of user agents for rotation
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Chrome/117.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/605.1.15",
];

function randomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Wrapper function
async function safeFacebookRequest(url, ytDlpFunction) {
  return queueRequest(url, async () => {
    // Optional: Add custom headers for yt-dlp using environment or axios (if needed)
    const headers = {
      "User-Agent": randomUserAgent(),
      "Referer": "https://www.facebook.com",
    };

    // Could add a proxy here if desired:
    // process.env.HTTPS_PROXY = "http://proxy_ip:port";

    // Wait a small random delay to mimic human behavior
    await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));

    // Call your existing downloadFacebook logic
    return ytDlpFunction(url);
  });
}

module.exports = { safeFacebookRequest };
