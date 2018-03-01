const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const scrapeBing = require("./scrapers/bing")

const PORT = process.env.PORT || 2000
const server = express()

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

server.listen(PORT, () => {
  console.log("Listening on port", PORT)
})