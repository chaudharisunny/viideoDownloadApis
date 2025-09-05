// routes/download.js
const express = require("express");
const routes = express.Router();

const YoutubeController=require('../controller/youtubePost')
const { checkInstagramLogin } = require("../middlware/checkInstagramLogin");
const { downloadInstagram, proxyMedia } = require("../controller/instagramPost");
const FacebookController=require('../controller/facebookPost')
const TwitterController=require('../controller/twitterPost');
const { fbLimiter } = require("../middlware/fbLimiter");
const { tweetLimiter } = require("../middlware/tweetLimiter");


routes.post('/youtubepost',YoutubeController.youtubePost)

routes.post("/downloadpost",checkInstagramLogin, downloadInstagram);

routes.get('/proxy',proxyMedia)

routes.post("/facebookpost",fbLimiter,FacebookController.downloadFacebook)

routes.post('/twitterpost',tweetLimiter,TwitterController.downloadTwitter)

module.exports = routes;
