const bing = require("nodejs-bing")

const DEV_MODE = (process.env.NODE_ENV !== "production") 

function log(str) {
  return DEV_MODE ? console.log(str) : null
}

const scrape = (query) => {
  return new Promise(resolve => {
    log(`scraping: ${query}`)

    bing.image(query).then(res => {
      res.forEach(el => log(el.mediaurl))
      
      return resolve(res)
    })
  })
}

module.exports = scrape