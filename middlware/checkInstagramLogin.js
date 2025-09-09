// controllers/instagram.js
const { scrapeInstagramMedia } = require("../service/Instagram/instagramService");
const { queueRequest } = require("../middlware/requestQueue");
const axios = require("axios");

const checkInstagramLogin = async (req, res) => {
  const { url } = req.body;
  const download = req.query.download === "true";

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const media = await queueRequest(url, async () => scrapeInstagramMedia(url));

    if (!media.imgs.length && !media.vids.length) {
      return res.status(404).json({ success: false, message: "No media found" });
    }

    if (download) {
      const mediaUrl = media.vids[0] || media.imgs[0];
      const mediaRes = await axios.get(mediaUrl, { responseType: "arraybuffer" });
      res.setHeader("Content-Type", mediaRes.headers["content-type"]);
      return res.send(mediaRes.data);
    }

    res.json({ success: true, media });
  } catch (err) {
    console.error("Scraping failed:", err);
    res.status(500).json({ success: false, error: "Scraping failed", details: err.message });
  }
};

module.exports = { checkInstagramLogin };
