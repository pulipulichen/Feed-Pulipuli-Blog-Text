const cheerio = require('cheerio')
const htmlentities = require('htmlentities')

module.exports = function ($, callback) {
  let entries = $('entry')
  let type = 'atom'
  if (entries.length === 0) {
    entries = $('item')
    type = 'rss'
  }

  for (let i = 0; i < entries.length; i++) {
    let entry = entries.eq(i)

    let $entry = cheerio.load(entry.html()) 
    // console.log(cheerio.load(entry.html()).html())

    let url = ''
    try {
      if (type === 'atom') {
        url = $entry('link[rel="alternate"][type="text/html"][href]:first').attr('href')
      }
      else {
        url = $entry('link').text().trim()
      }
        
    }
    catch (e) {
      url = e
    }

    let title = ''
    try {
      if (type === 'atom') {
        title = $entry('link[rel="alternate"][type="text/html"][href]:first').attr('title')
      }
      else {
        title = $entry('title').text().trim()
      }
    }
    catch (e) {
      title = e
    }

    // console.log(title)
    let content
    if (type === 'atom') {
      content = $entry('content').html()
    }
    else {
      content = $entry('description').html()
    }

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
    if (type === 'atom') {
      $(`entry:eq(${i}) content`).text(text)
    }
    else {
      $(`item:eq(${i}) description`).text(text)
    }
    // console.log($(`entry:eq(${i}) content`).html())
  }
}