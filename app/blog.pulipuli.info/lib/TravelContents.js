const cheerio = require('cheerio')
const htmlentities = require('htmlentities')
const TravelItems = require('./TravelItems.js')

module.exports = function ($, callback) {
  TravelItems($, (container, url, title, type, i) => {
    let text = callback($, container, url, title)
    // console.log(text)
    // text = 'AAAAAAAAAAAAAA'
    if (type === 'atom') {
      $(`entry:eq(${i}) content`).text(text)
    }
    else {
      $(`item:eq(${i}) description`).text(text)
    }
    // console.log($(`entry:eq(${i}) content`).html())
  })
}