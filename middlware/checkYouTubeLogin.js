// middleware/checkYouTubeLogin.js
const { ensureCookies } = require("../middlware/youtubeCookieManger");

async function checkYoutubeLogin(req, res, next) {
  try {
    // Must be authenticated first
    if (!req.user || !req.user.isLoggedIn) {
      return res.status(403).json({
        success: false,
        message: "You must be logged in to access YouTube videos.",
      });
    }

    // Auto-refresh cookies
    req.ytCookiesPath = await ensureCookies(
      process.env.YT_EMAIL,
      process.env.YT_PASSWORD
    );

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "YouTube login failed" });
  }
}

module.exports = { checkYoutubeLogin };
