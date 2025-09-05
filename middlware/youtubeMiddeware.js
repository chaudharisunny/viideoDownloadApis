// middleware/youtubeMiddleware.js
function validateYoutubeUrl(url) {
  if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url)) {
    console.error(url)
    throw new Error("Valid YouTube URL required");
  }
  return url;
}

module.exports = { validateYoutubeUrl };
