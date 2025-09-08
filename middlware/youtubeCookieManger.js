// middleware/youtubeCookieManager.js
const fs = require("fs-extra");
const { chromium } = require("playwright");

const COOKIE_PATH = "./cookies.json";
const YOUTUBE_LOGIN_URL = "https://accounts.google.com/signin/v2/identifier";

// Check if cookies exist and are recent (<7 days)
async function hasValidCookies() {
  if (!await fs.pathExists(COOKIE_PATH)) return false;

  const stats = await fs.stat(COOKIE_PATH);
  const ageInMs = Date.now() - stats.mtimeMs;
  return ageInMs < 7 * 24 * 60 * 60 * 1000;
}

// Login to YouTube and save cookies
async function loginYouTube(email, password) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(YOUTUBE_LOGIN_URL);
  await page.fill("input[type='email']", email);
  await page.click("button:has-text('Next')");
  await page.waitForTimeout(2000);
  await page.fill("input[type='password']", password);
  await page.click("button:has-text('Next')");
  await page.waitForTimeout(5000);

  await context.storageState({ path: COOKIE_PATH });
  await browser.close();
  console.log("YouTube login complete, cookies saved!");
}

// Ensure cookies exist and refresh if expired
async function ensureCookies(email, password) {
  if (!await hasValidCookies()) {
    console.log("Refreshing YouTube cookies...");
    await loginYouTube(email, password);
  }
  return COOKIE_PATH;
}

module.exports = { ensureCookies };
