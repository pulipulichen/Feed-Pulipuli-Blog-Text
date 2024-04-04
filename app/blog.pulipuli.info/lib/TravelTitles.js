// const cheerio = require('cheerio')
// const htmlentities = require('htmlentities')
const TravelItems = require('./TravelItems.js')

module.exports = function ($, callback) {
  TravelItems($, (container, url, title, type, i) => {
    title = callback($, container, url, title)
    // console.log(text)
    // text = 'AAAAAAAAAAAAAA'
    

    $(`entry:eq(${i}) title`).text(title)
    $(`entry:eq(${i}) link[rel="alternate"][title]`).attr('title', title)
  })
}