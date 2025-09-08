const { getYoutubeInfo } = require("../service/youtube/youtubeService");
const { validateYoutubeUrl } = require("../middlware/youtubeMiddeware");

const youtubePost = async (req, res) => {
  try {
    // Validate URL
    const url = validateYoutubeUrl(req.body.url);

    // Fetch YouTube info (uses cache + fast getBasicInfo)
    const info = await getYoutubeInfo(url);

    res.json({ success: true, ...info });
  } catch (err) {
    console.error("YouTube download error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

const youtubeGet = async (req, res) => {
  try {
    // Get URL from query string: /api/youtube?url=YOUTUBE_URL
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    // Validate URL
    validateYoutubeUrl(url);

    // Fetch YouTube info
    const info = await getYoutubeInfo(url);

    res.json({ success: true, ...info });
  } catch (err) {
    console.error("YouTube download error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { youtubePost,youtubeGet };
