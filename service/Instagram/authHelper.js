const fs = require("fs");
const path = require("path");

const SESSION_FILE = path.join(__dirname, "auth.json");

/**
 * Save session cookies after login
 * @param {object} storageState - playwright storageState JSON
 */
function saveSession(storageState) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(storageState, null, 2), "utf-8");
  console.log("✅ Session saved to", SESSION_FILE);
}

/**
 * Check if session exists and is valid
 * Only checks cookie presence + expiry (does not call Instagram)
 */
function isLoggedIn() {
  if (!fs.existsSync(SESSION_FILE)) {
    return false;
  }

  try {
    const state = JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
    const session = state.cookies.find(c => c.name === "sessionid");

    if (!session) return false;

    // Check if expired
    if (session.expires && new Date(session.expires * 1000) < new Date()) {
      return false;
    }

    return true;
  } catch (err) {
    console.error("⚠️ Error reading session file:", err.message);
    return false;
  }
}

/**
 * Get storage state for Playwright context
 */
function getSession() {
  if (!fs.existsSync(SESSION_FILE)) return null;
  return JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
}

module.exports = {
  saveSession,
  isLoggedIn,
  getSession
};
