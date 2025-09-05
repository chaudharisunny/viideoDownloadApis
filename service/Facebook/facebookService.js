// service/facebookService.js
const { exec } = require("child_process");

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Chrome/117.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/605.1.15",
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function buildYtDlpCommand(url, proxyConfig) {
  const ua = getRandomUserAgent();
  let cmd = `yt-dlp -j --no-warnings --no-check-certificate --user-agent "${ua}" "${url}"`;

  if (proxyConfig) {
    cmd += ` --proxy "${proxyConfig.server}"`;
    if (proxyConfig.username && proxyConfig.password) {
      cmd += ` --proxy-username "${proxyConfig.username}" --proxy-password "${proxyConfig.password}"`;
    }
  }

  return cmd;
}

/**
 * Fetch Facebook media using yt-dlp
 * Supports optional proxy
 * Retry logic included
 */
async function fetchFacebookMedia(url, proxy, retries = 1) {
  try {
    const cmd = buildYtDlpCommand(url, proxy);
    return await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(new Error(stderr || "yt-dlp failed"));

        let info;
        try {
          info = JSON.parse(stdout.trim());
        } catch {
          return reject(new Error("Failed to parse media info"));
        }

        const videoUrl = info?.url || null;
        const imageUrl = info?.thumbnail || null;

        if (!videoUrl && !imageUrl) {
          return reject(new Error("No media found"));
        }

        resolve({ videoUrl, imageUrl });
      });
    });
  } catch (err) {
    if (retries > 0) return fetchFacebookMedia(url, proxy, retries - 1);
    throw err;
  }
}

module.exports = { fetchFacebookMedia };
