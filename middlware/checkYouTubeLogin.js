// middleware/checkYouTubeLogin.js
function checkYouTubeLogin(req, res, next) {
  // Example: check if user is logged in via your session / JWT
  // This assumes you have req.user set after authentication
  if (!req.user || !req.user.isLoggedIn) {
    return res.status(403).json({
      success: false,
      message: "You must be logged in to access YouTube videos.",
    });
  }

  // User is logged in, continue
  next();
}

module.exports = { checkYouTubeLogin };
