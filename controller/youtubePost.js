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

module.exports = { youtubePost };
