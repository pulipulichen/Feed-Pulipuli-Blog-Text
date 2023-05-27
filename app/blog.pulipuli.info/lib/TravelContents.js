const cheerio = require('cheerio')
const htmlentities = require('htmlentities')

module.exports = function ($, callback) {
  let entries = $('entry')
  for (let i = 0; i < entries.length; i++) {
    let entry = entries.eq(i)

    let $entry = cheerio.load(entry.html()) 
    // console.log(cheerio.load(entry.html()).html())

    let url = ''
    try {
      url = $entry('link[rel="alternate"][type="text/html"][href]:first').attr('href')
    }
    catch (e) {
      url = e
    }

    let title = ''
    try {
      title = $entry('link[rel="alternate"][type="text/html"][href]:first').attr('title')
    }
    catch (e) {
      title = e
    }

    // console.log(title)
    let content = $entry('content').html()
    content = htmlentities.decode(content)
    // console.log(content)
    if (!content.startsWith('<p>')) {
      let pos = content.indexOf('<div')
      if (pos > -1) {
        let part1 = content.slice(0, pos)
        let part2 = content.slice(pos)
        content = '<p>' + part1 + '</p>' + part2
      }
      else {
        content = '<p>' + content + '</p>'
      }
    }
    // console.log($entry('content').html())
    let container = cheerio.load(content);
    let text = callback($, container, url, title)
    // console.log(text)
    // text = 'AAAAAAAAAAAAAA'
    $(`entry:eq(${i}) content`).text(text)
    // console.log($(`entry:eq(${i}) content`).html())
  }
}