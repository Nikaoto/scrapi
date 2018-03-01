const bing = require("nodejs-bing")
const Promise = require("bluebird")

const debugMode = false

function log(str) {
  return debugMode ? console.log(str) : null
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