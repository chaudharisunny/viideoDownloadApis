// middlware/requestQueue.js
const ongoingRequests = new Map();

async function queueRequest(key, fn) {
  if (ongoingRequests.has(key)) {
    return ongoingRequests.get(key);
  }

  const promise = fn().finally(() => {
    ongoingRequests.delete(key);
  });

  ongoingRequests.set(key, promise);
  return promise;
}

module.exports = { queueRequest };
