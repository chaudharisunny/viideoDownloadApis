// service/Instagram/instagramService.js
const { chromium } = require("playwright");
const { getSession } = require("./authHelper");
const { exec } = require("child_process");

async function scrapeInstagramMedia(url) {
  const browser = await chromium.launch({
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

  const context = await browser.newContext({
    storageState: getSession() || undefined
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  // Scrape media from page
  let media = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img")).map(i => i.src);
    const vids = Array.from(document.querySelectorAll("video")).map(v => v.src);
    return { imgs, vids };
  });

  await browser.close();

  // Fallback to yt-dlp if no media found
  if (!media.imgs.length && !media.vids.length) {
    await new Promise(resolve => {
      exec(`yt-dlp -f best -g "${url}"`, (err, stdout) => {
        if (!err && stdout.trim()) {
          media.vids = [stdout.trim()];
        }
        resolve();
      });
    });
  }

  return media;
}

module.exports = { scrapeInstagramMedia };
