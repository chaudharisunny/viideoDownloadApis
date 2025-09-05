// controllers/twitterController.js
const { fetchTwitterMedia } = require("../controller/fetchTwitterMedia");
const { twitterQueueRequest } = require("../middlware/twitterQueue");

const downloadTwitter = async (req, res) => {
  const { url, proxy } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const media = await twitterQueueRequest(url, () => fetchTwitterMedia(url, proxy));
    res.json({ success: true, media });
  } catch (err) {
    console.error("Twitter download error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { downloadTwitter };
