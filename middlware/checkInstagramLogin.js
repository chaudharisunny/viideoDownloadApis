const { chromium } = require("playwright");
const { exec } = require("child_process");
const axios = require("axios");
const { isLoggedIn, getSession } = require("../service/Instagram/authHelper");


const checkInstagramLogin = async (req, res) => {
  const { url } = req.body;
  const download = req.query.download === "true";

  if (!url) return res.status(400).json({ error: "URL is required" });

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--disable-gpu",
        "--single-process"
      ]
    });

    const context = isLoggedIn()
      ? await browser.newContext({ storageState: getSession() })
      : await browser.newContext();

    const page = await context.newPage();

    // Go to the Instagram URL silently
    await page.goto(url, { waitUntil: "networkidle" });

    // Scrape images/videos
    const media = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img")).map(el => el.src);
      const vids = Array.from(document.querySelectorAll("video")).map(el => el.src);
      return { imgs, vids };
    });

    let videoUrl = media.vids.length ? media.vids[0] : null;
    let imageUrl = media.imgs.length ? media.imgs[0] : null;

    // Fallback to yt-dlp if nothing found
    if (!videoUrl && !imageUrl) {
      await new Promise(resolve => {
        exec(`yt-dlp -f best -g "${url}"`, (err, stdout) => {
          if (!err && stdout.trim()) {
            videoUrl = stdout.trim();
          }
          resolve();
        });
      });
    }

    await browser.close();

    if (!videoUrl && !imageUrl) {
      return res.status(404).json({
        success: false,
        message: "No media found"
      });
    }

    // Stream file if download=true
    if (download) {
      const mediaUrl = videoUrl || imageUrl;
      const mediaRes = await axios.get(mediaUrl, { responseType: "arraybuffer" });
      res.setHeader("Content-Type", mediaRes.headers["content-type"]);
      return res.send(mediaRes.data);
    }

    // Otherwise return JSON URLs
    return res.json({
      success: true,
      url,
      videoUrl: videoUrl || null,
      imageUrl: imageUrl || null,
      type: videoUrl ? "video" : "image",
      loggedIn: isLoggedIn()
    });

  } catch (err) {
    if (browser) await browser.close();
    console.error("Instagram scraping failed:", err);
    return res.status(500).json({ success: false, error: "Scraping failed", details: err.message });
  }
};

module.exports = { checkInstagramLogin };
