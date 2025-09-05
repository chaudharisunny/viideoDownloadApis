// service/Instagram/instagramService.js
const { chromium } = require("playwright-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

chromium.use(StealthPlugin());

let globalBrowser;

async function getBrowser() {
  if (!globalBrowser) {
    globalBrowser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
  }
  return globalBrowser;
}

function randomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Chrome/117.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/605.1.15",
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function scrapeInstagramMedia(url) {
  let browser;
  try {
    browser = await getBrowser();

    const context = await browser.newContext({
      userAgent: randomUserAgent(),
      viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(1500);

    // Extract post JSON directly from <script> tag
    const post = await page.evaluate(() => {
      function safeParse(str) {
        try { return JSON.parse(str); } catch { return null; }
      }

      // Look for shortcode_media JSON
      const script = Array.from(document.querySelectorAll("script")).find(s =>
        s.textContent.includes("shortcode_media")
      );
      if (!script) return null;

      const match = script.textContent.match(/{.*}/);
      if (!match) return null;

      const json = safeParse(match[0]);
      if (!json) return null;

      return json?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media || null;
    });

    if (!post) throw new Error("No media data found");

    let result = {
      success: true,
      url,
      videoUrl: null,
      imageUrl: null,
      type: null
    };

    if (post.is_video) {
      result.videoUrl = post.video_url;
      result.type = "video";
    } else {
      result.imageUrl = post.display_url;
      result.type = "image";
    }

    await context.close();
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports = { scrapeInstagramMedia };
