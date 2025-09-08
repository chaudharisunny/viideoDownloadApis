const ytdlp = require("yt-dlp-exec");

// Simple in-memory cache
const cache = new Map();

async function getYoutubeInfo(url) {
  if (cache.has(url)) return cache.get(url);

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      skipDownload: true,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.97 Safari/537.36",
    });

    const videoFormat = info.formats?.find(f => f.format_id === "18") || null;
    const audioFormat = info.formats
      ?.filter(f => f.acodec !== "none" && f.vcodec === "none")
      .sort((a, b) => b.abr - a.abr)[0] || null;

    const result = {
      title: info.title,
      author: info.uploader,
      duration: info.duration,
      thumbnail: info.thumbnail,
      video: videoFormat?.url || null,
      audio: audioFormat?.url || null,
    };

    // Cache for 5 minutes
    cache.set(url, result);
    setTimeout(() => cache.delete(url), 5 * 60 * 1000);

    return result;
  } catch (err) {
    const stderr = err.stderr || err.message || "";

    // Bot-detection / 429
    if (/HTTP Error 429|Sign in to confirm you’re not a bot/i.test(stderr)) {
      throw new Error(
        "YouTube blocked this request. Too many requests or bot detection triggered. Try again later."
      );
    }

    throw new Error(`Failed to fetch YouTube info: ${stderr}`);
  }
}

module.exports = { getYoutubeInfo };
