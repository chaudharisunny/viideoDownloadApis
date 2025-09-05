// services/twitterService.js
const { exec } = require("child_process");

// Random user agents for detection avoidance
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/116.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) Chrome/117.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/605.1.15",
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Optional proxy support: { server, username, password }
function buildYtDlpCommand(url, proxy) {
  const ua = getRandomUserAgent();
  let cmd = `yt-dlp --print-json --no-warnings --user-agent "${ua}" "${url}"`;

  if (proxy) {
    cmd += ` --proxy "${proxy.server}"`;
    if (proxy.username && proxy.password) {
      cmd += ` --proxy-username "${proxy.username}" --proxy-password "${proxy.password}"`;
    }
  }

  return cmd;
}

/**
 * Fetch Twitter media via yt-dlp
 * Supports optional proxy and retry logic
 */
async function fetchTwitterMedia(url, proxy = null, retries = 1) {
  try {
    const cmd = buildYtDlpCommand(url, proxy);

    return await new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || "yt-dlp failed"));

        try {
          const lines = stdout.trim().split("\n");
          const info = JSON.parse(lines[lines.length - 1]);

          let videoUrl = info.url || null;

          if (!videoUrl && info.formats?.length) {
            const best = info.formats
              .filter(f => f.vcodec !== "none")
              .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
            if (best) videoUrl = best.url;
          }

          const thumbnail = info.thumbnail || info.thumbnails?.[0]?.url || null;

          if (!videoUrl && !thumbnail) return reject(new Error("No media found"));

          resolve({ videoUrl, thumbnail, type: videoUrl ? "video" : "image" });
        } catch {
          reject(new Error("Failed to parse yt-dlp response"));
        }
      });
    });
  } catch (err) {
    if (retries > 0) return fetchTwitterMedia(url, proxy, retries - 1);
    throw err;
  }
}

module.exports = { fetchTwitterMedia };
