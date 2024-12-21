
const outputFilename = 'simple-20230527-0548.rss'

// ---------

const GetHTML = require('../lib/GetHTML.js')
const FixThumbnail = require('./lib/FixThumbnail.js')
const TravelContents = require('./lib/TravelContents.js')

const SaveXML = require('../lib/SaveXML.js')

const ModifyContentSimple = require('./ModifyContentSimple.js')

// ---------



module.exports = async function () {
  let $ = await GetHTML(`https://blog.pulipuli.info/feeds/posts/default`, {
    crawler: 'xml'
  })

  console.log("Processing: " + outputFilename)
  // console.log('not ok')

  FixThumbnail($)
  TravelContents($, ModifyContentSimple)

  SaveXML($, outputFilename)
}