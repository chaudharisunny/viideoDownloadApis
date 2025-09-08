
const express = require('express')
const app = express()
const cors=require('cors')
const path=require('path')
const port =process.env.PORT|| 3000
const indexRoutes=require('./routes/index')
const rateLimit = require('express-rate-limit');
app.use(express.json())
app.use(rateLimit())

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // max 100 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.use(cors({
  origin: [
    "http://localhost:5173",                 // Local dev
    "https://video-downloads-frontend.vercel.app" // Production
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.post('/api/v1/youtubepost', (req, res) => {
  console.log(req.body); // logs { url: '...' } when frontend sends request
  res.json({ success: true, url: req.body.url });
});

app.use("/downloads", express.static(path.join(__dirname, "downloads")));
app.use('/api/v1',indexRoutes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))