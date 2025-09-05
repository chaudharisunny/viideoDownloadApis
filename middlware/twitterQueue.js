// middlware/twitterQueue.js
const PQueue = require("p-queue").default;

// Smarter queue: limit concurrency and add interval jitter
const queue = new PQueue({
  concurrency: 2,        // max 2 concurrent requests
  intervalCap: 2,        // max 2 requests per interval
  interval: 1000,        // interval in ms
  carryoverConcurrencyCount: true,
});

async function twitterQueueRequest(key, fn) {
  // Add random delay before execution to mimic human timing
  const jitter = Math.floor(Math.random() * 500); // 0-500ms
  return queue.add(async () => {
    await new Promise(r => setTimeout(r, jitter));
    return fn();
  });
}

module.exports = { twitterQueueRequest };
