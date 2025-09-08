// middleware/checkYouTubeLogin.js
const { ensureCookies } = require("../middlware/youtubeCookieManger");

// Example middleware for API route
async function checkYoutubeLogin(req, res, next) {
  try {
    // Only allow your authenticated users
    if (!req.user || !req.user.isLoggedIn) {
      return res.status(403).json({
        success: false,
        message: "You must be logged in to access YouTube videos.",
      });
    }

    // Auto-refresh cookies
    // Use environment variables for login
    const cookiesPath = await ensureCookies(
      process.env.YT_EMAIL,
      process.env.YT_PASSWORD
    );

    req.ytCookiesPath = cookiesPath;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "YouTube login failed" });
  }
}

module.exports = { checkYoutubeLogin };
