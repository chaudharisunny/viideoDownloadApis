const { isLoggedIn } = require("../../service/Instagram/authHelper");

const attachInstagramSession = (req, res, next) => {
  req.isLoggedIn = isLoggedIn();
  next();
};

module.exports = { attachInstagramSession };
