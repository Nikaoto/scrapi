const PORT = process.env.PORT || 2000

const fetch = require("node-fetch")
const bodyParser = require("body-parser")
const cors = require("cors")
const express = require("express")

// Scrapper(s)
const scrapeBing = require("./scrapers/bing")


const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
  res.end("Hi :^)")
})


app.get("/images", ({ query }, response) => {
  console.log("GET /bing :", query)

  const max = parseInt(query.max) || 1

  scrapeBing(query.query.toString())
    .then(scrapeResult => {
      const results = scrapeResult.slice(0, max).map(res =>
        ({
          url: res.mediaurl,
          thumbnailUrl: res.mediaurl,
          title: res.title,
          source: res.link,
          info: res.size
        })
      )

      response.json(results)

    }).catch(err => { 
      console.log("err")
      response.json("Error") 
    })
})

app.get("/proxy", (req, response) => {
  const url = req.query.url
  if (url && url.length > 0) {
    fetch(url)
      .then(res => res.body.pipe(response))
      .catch(err => console.log(err))
  }
})

app.listen(PORT, () => {
  console.log("Listening on port", PORT)
})
