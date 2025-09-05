// services/youtubeService.js
const ytdlp = require("yt-dlp-exec");

// Simple in-memory cache
const cache = new Map();

async function getYoutubeInfo(url) {
  if (cache.has(url)) return cache.get(url);

  // Fetch metadata
  const info = await ytdlp(url, {
    dumpSingleJson: true,
    skipDownload: true,
  });

  // Find direct video URL (mp4 360p)
  const videoFormat = info.formats?.find(f => f.format_id === "18") || null;

  // Find direct audio URL (best audio with container like mp3/m4a)
  const audioFormat = info.formats
    ?.filter(f => f.acodec !== "none" && f.vcodec === "none")
    .sort((a, b) => b.abr - a.abr)[0] || null;

  const result = {
    title: info.title,
    author: info.uploader,
    duration: info.duration,
    thumbnail: info.thumbnail,
    video: videoFormat?.url || null,
    audio: audioFormat?.url || null, // now direct audio stream (mp3/m4a)
  };

  // Cache for 5 min
  cache.set(url, result);
  setTimeout(() => cache.delete(url), 5 * 60 * 1000);

  return result;
}

module.exports = { getYoutubeInfo };
