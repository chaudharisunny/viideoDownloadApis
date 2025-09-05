// controllers/instagram.js
const axios = require("axios");
const { scrapeInstagramMedia } = require("../service/Instagram/instagramService");
const { queueRequest } = require("../middlware/requestQueue");

const downloadInstagram = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const media = await queueRequest(url, async () => {
      return await scrapeInstagramMedia(url);
    });

    res.json({ success: true, media });
  } catch (err) {
    console.error("Scraping failed:", err.message);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};

const proxyMedia = async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).send("Missing url param");
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    console.error("Proxy failed:", err.message);
    res.status(500).send("Proxy failed");
  }
};

module.exports = { downloadInstagram, proxyMedia };
