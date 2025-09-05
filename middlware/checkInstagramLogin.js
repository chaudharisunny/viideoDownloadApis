const { chromium } = require("playwright");
const { exec } = require("child_process");
const axios = require("axios");

const checkInstagramLogin = async (req, res) => {
  const { url } = req.body;
  const download = req.query.download === "true";

  if (!url) return res.status(400).json({ error: "URL is required" });

  const isLoggedIn = req.isLoggedIn;
  let browser;
  let videoUrl = null;
  let imageUrl = null;

  try {
    browser = await chromium.launch({ headless: true });
    const context = isLoggedIn
      ? await browser.newContext({ storageState: "auth.json" })
      : await browser.newContext();

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    // Private post check
    if (!isLoggedIn) {
      const loginForm = await page.$("input[name='username']");
      if (loginForm) {
        await browser.close();
        return res.status(403).json({
          success: false,
          message: "Private post. Login required to access.",
        });
      }
    }

    // Scrape media
    const media = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img")).map(el => el.src);
      const vids = Array.from(document.querySelectorAll("video")).map(el => el.src);
      return { imgs, vids };
    });

    if (!media.imgs.length && !media.vids.length) {
      await new Promise(resolve => {
        exec(`yt-dlp -f best -g "${url}"`, (err, stdout) => {
          if (!err) videoUrl = stdout.trim();
          resolve();
        });
      });
    }

    imageUrl = media.imgs.length ? media.imgs[0] : null;
    videoUrl = media.vids.length ? media.vids[0] : videoUrl;

    if (!videoUrl && !imageUrl) {
      await browser.close();
      return res.status(404).json({
        success: false,
        message: "No media found",
      });
    }

    await browser.close();

    if (download) {
      // Serve media as blob to frontend
      const mediaUrl = videoUrl || imageUrl;
      const mediaRes = await axios.get(mediaUrl, { responseType: "arraybuffer" });
      res.setHeader("Content-Type", mediaRes.headers["content-type"]);
      return res.send(mediaRes.data);
    }

    // Otherwise, return JSON URLs
    return res.json({
      success: true,
      url,
      videoUrl: videoUrl || null,
      imageUrl: imageUrl || null,
      type: videoUrl ? "video" : "image",
    });

  } catch (err) {
    if (browser) await browser.close();
    console.error(err);
    return res.status(500).json({ success: false, error: "Scraping failed" });
  }
};

module.exports = { checkInstagramLogin };
