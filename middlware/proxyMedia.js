const axios=require('axios')

const proxyMedia = async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).send("Missing url param");
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    console.error("Proxy failed:", err.message);
    res.status(500).send("Proxy failed");
  }
};

module.exports={proxyMedia}