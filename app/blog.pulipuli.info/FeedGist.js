// const textLimit = 5000
// const textLimit = 1000
const outputFilename = 'gist-20230621-0011.rss'

// ---------

const GetHTML = require('../lib/GetHTML.js')
const FixThumbnail = require('./lib/FixThumbnail.js')
const TravelTitles = require('./lib/TravelTitles.js')
const TravelContents = require('./lib/TravelContents.js')
const ModifyContentGist = require('./ModifyContentGist.js')

const SaveXML = require('../lib/SaveXML.js')

// ---------

let modifyTitle = function ($, container, url, title) {
  if (title.indexOf('/')) {
    title = title.split('/').join(':')
  }
  return title
}

module.exports = async function () {
  let $ = await GetHTML(`https://blog.pulipuli.info/feeds/posts/default`, {
    crawler: 'xml'
  })

  // console.log('not ok')

  FixThumbnail($)
  TravelTitles($, modifyTitle)
  TravelContents($, ModifyContentGist)

  SaveXML($, outputFilename)
}