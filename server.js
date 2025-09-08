const express = require('express')
const app = express()
const cors=require('cors')
const path=require('path')
const port = 3000
const indexRoutes=require('./routes/index')
const rateLimit = require('express-rate-limit');
app.use(express.json())
app.use(rateLimit())
app.use(cors())

app.use("/downloads", express.static(path.join(__dirname, "downloads")));
app.use('/api/v1',indexRoutes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))