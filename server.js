const DEV_MODE = (process.env.NODE_ENV !== "production")
if (DEV_MODE) {
  require("dotenv").load()
}

const express = require("express")
const fetch = require("node-fetch")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require("cors")

const scrapeBing = require("./scrapers/bing")

const aws = require("aws-sdk")
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
const AWS_REGION = process.env.AWS_REGION
aws.config.region = AWS_REGION

const PORT = process.env.PORT || 2000
//const DOMAIN = DEV_MODE ? "https://localhost:"+PORT : "https://scr-api.herokuapp.com:"+PORT
const server = express()

//const fs = require("fs")
// Create downloads folder
// if (!fs.existsSync("./downloads")) {
//   fs.mkdirSync("./downloads")
// }
//server.use(express.static(path.join(__dirname, "downloads")))

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

server.get("/list", (req, res) => {
  console.log("GET /list bucket:", S3_BUCKET_NAME)
  const s3 = new aws.S3()
  s3.listObjects({ Bucket: S3_BUCKET_NAME }, (err, data) => {
    if (err) {
      console.log("ERROR:", err)
      return
    }

    console.log(data)
    res.json(data)
  })
})

const getS3Url = (fileKey) => `https://s3.${AWS_REGION}.amazonaws.com/${S3_BUCKET_NAME}/${encodeURIComponent(fileKey)}`

server.get("/download", ({ query }, res) => {
  console.log("GET /download :", query)
  //const fileName = query.url.replace(/\/|:/g, "")
  const imageKey = encodeURIComponent(query.url)
  console.log("imageKey:", imageKey)


  const s3 = new aws.S3()
  s3.listObjects({ Bucket: S3_BUCKET_NAME }, (err, data) => {
    if (err) {
      console.log("ERROR:", err)
      return
    }

    const fileExists = data.Contents.map(obj => obj.Key).includes(imageKey)

    if (fileExists) {
      console.log("File already exists, returning url")
      res.json({ url: getS3Url(imageKey) })
      return
    }

    console.log("File doesn't exist, starting upload")

    fetch(query.url)
      .then(img => {
        // TODO promisify this
        const params = { Bucket: S3_BUCKET_NAME, Key: imageKey, Body: img.body, ACL:"public-read" }
        s3.upload(params, (err, data) => { 
          if (err) {
            console.log("ERROR while uploading:", err)
            res.end()
          } else {
            console.log("Upload successful! data:", data)
            res.json({ url: data.Location })
          }
        })

      }).catch(err => console.log("ERROR:", err))
  })
})



server.listen(PORT, () => {
  console.log("Listening on port", PORT)
})