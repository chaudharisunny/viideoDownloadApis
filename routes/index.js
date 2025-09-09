// routes/download.js
const express = require("express");
const routes = express.Router();

const YoutubeController=require('../controller/youtubePost')
const { checkInstagramLogin } = require("../middlware/checkInstagramLogin");
const { downloadInstagram, proxyMedia, downloadInstagramGET } = require("../controller/instagramPost");
const FacebookController=require('../controller/facebookPost')
const TwitterController=require('../controller/twitterPost');
const { fbLimiter } = require("../middlware/fbLimiter");
const { tweetLimiter } = require("../middlware/tweetLimiter");
const Ytlimiter = require("../middlware/ytLimiter");
const { checkYoutubeLogin } = require("../middlware/checkYouTubeLogin");
const { attachInstagramSession } = require("../service/Instagram/instagramSession");

routes.get("/hello", (req, res) => {
  res.json({ message: "Hello from backend 👋" });
});

// Example POST route
routes.post("/test", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello ${name}, backend is connected ✅` });
});

routes.post('/youtubepost',Ytlimiter,YoutubeController.youtubePost)
routes.get('/youtube',checkYoutubeLogin,YoutubeController.youtubeGet)

routes.post("/downloadpost",attachInstagramSession,checkInstagramLogin, downloadInstagram);
routes.get('/download',attachInstagramSession,downloadInstagramGET)
routes.get('/proxy',proxyMedia)

routes.post("/facebookpost",fbLimiter,FacebookController.downloadFacebook)

routes.post('/twitterpost',tweetLimiter,TwitterController.downloadTwitter)

module.exports = routes;
