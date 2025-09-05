// Rotate between multiple proxies
const proxies = [
  "http://user:pass@proxy1:port",
  "http://user:pass@proxy2:port",
  "http://proxy3:port",
];

let index = 0;

function getNextProxy() {
  const proxy = proxies[index];
  index = (index + 1) % proxies.length;
  return proxy;
}

module.exports = { getNextProxy };
