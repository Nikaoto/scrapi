const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const fs = require("fs")
const download = require("image-downloader")
const cors = require("cors")

const scrapeBing = require("./scrapers/bing")

const devMode = true

const PORT = process.env.PORT || 2000
const DOMAIN = devMode ? "https://localhost:"+PORT : "https://scr-api.herokuapp.com:"+PORT
const server = express()

// Create downloads folder
if (!fs.existsSync("./downloads")) {
  fs.mkdirSync("./downloads")
}

server.use(express.static(path.join(__dirname, "downloads")))
server.use(bodyParser.json())
server.use(cors())

server.get("/", (req, res) => {
  res.send("Hi :^)")
  res.end()
})

server.get("/bing", ({ query }, res) => {
  console.log("GET /bing :", query)

  const max = parseInt(query.max) || 1

  scrapeBing(query.query.toString())
    .then(scrapeResult => res.json(scrapeResult.slice(0, max)))
    .catch(err => { 
      console.log("err")
      res.json("Error") 
    })
})

server.get("/download", ({ query }, res) => {
  console.log("GET /download :", query)
  const fileName = query.url.replace(/\/|:/g, "")
  console.log("fileName:", fileName)

  // TODO search if image already downloaded (with url)

  const options = { 
    url: query.url, 
    dest: path.join(__dirname, "downloads")
  }

  download.image(options)
    .then(({ filename, image }) => {
      console.log("Image saved to", path.join(__dirname, filename))

      res.json({ url: path.join(DOMAIN, filename) })
    }).catch(err => console.log(err))

})

server.listen(PORT, () => {
  console.log("Listening on port", PORT)
})