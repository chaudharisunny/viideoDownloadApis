// controllers/facebookController.js
const { fetchFacebookMedia } = require("../service/Facebook/facebookService");
const { safeFacebookRequest } = require("../middlware/facebookRequestQueue");

const downloadFacebook = async (req, res) => {
  const { url, proxy } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    // Use queue to avoid duplicate requests for the same URL
    const media = await safeFacebookRequest(url, () => fetchFacebookMedia(url, proxy));
    res.json({ success: true, media });
  } catch (err) {
    console.error("Facebook download error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { downloadFacebook };
