const textLimit = 100
const outputFilename = 'tiny-20230527-0548.rss'

// ---------

const GetHTML = require('./../lib/GetHTML.js')
const FixThumbnail = require('./lib/FixThumbnail.js')
const TravelContents = require('./lib/TravelContents.js')
const isURL = require('./../lib/isURL.js')

const SaveXML = require('./../lib/SaveXML.js')

// ---------

let modifyContent = function ($, container, url, title) {

  let text = []
  let pList = container('p,hr,h2,h3,h4,ul,ol,pre,blockquote')
  let isOverflowed = false
  for (let i = 0; i < pList.length; i++) {
    let p = pList.eq(i)

    let tagName = p.prop('tagName').toLowerCase()
    if (tagName === 'hr') {
      text.push('----')

      continue
    }
    else if (tagName === 'ol' || tagName === 'ul') {
      let liElementList = p.children('li')

      let liTextList = []
      for (let i = 0; i < liElementList.length; i++) {
        let liText = liElementList.eq(i).text().trim()
        if (tagName === 'ol') {
          liText = (i+1) + '. ' + liText
        }
        else {
          liText = '- ' + liText
        }
        liTextList.push(liText)
      }
      // liTextList = [
      //   '\n<br />',
      //   ...liTextList,
      //   '\n<br />'
      // ]
      text = text.concat(liTextList)
      continue
    }
    else if (tagName === 'pre') {
      if (p.find('code').length > 0) {
        text.push('[Code...]')
      }
      continue
    }
    else if (tagName === 'blockquote') {
      let quote = p.text().trim()
      quote = '| ' + quote
      text.push(quote)
      continue
    }

    let t = p.text().trim()

    if (isURL(t)) {
      try {
        let domain = (new URL(t))
        t = `[URL: ${domain.hostname}]`
      }
      catch (e) {

      }
    }

    if (tagName === 'h2') {
      if (t.indexOf(' / ') > -1) {
        t = t.slice(0, t.indexOf(' / '))
      } 
      t = '# ' + t
    }
    else if (tagName === 'h3') {
      if (t.indexOf(' / ') > -1) {
        t = t.slice(0, t.indexOf(' / '))
      } 
      t = '## ' + t
    }
    else if (tagName === 'h4') {
      if (t.indexOf(' / ') > -1) {
        t = t.slice(0, t.indexOf(' / '))
      } 
      t = '### ' + t
    }
    
    // text.push(t)
    // 20230109-1126 再分句看看
    if (t.length > 20) {
      let sentence = t.split('。').map(s => {
        s = s.trim()
        if (s !== '') {
          s = s + '。'
        }
        return s
      }).filter(s => s !== '')

      text = text.concat(sentence)
    }
    else {
      text.push(t)
    }
    
    if (text.join('').length > textLimit) {
      text = text.slice(0, -1)

      while (text[(text.length - 1)].trim() === '--' || text[(text.length - 1)].trim().startsWith('#')) {
        text = text.slice(0, -1)
      }
      isOverflowed = true
      break
    }
  }

  while (text.length > 1 && text.join('').length > textLimit) {
    text = text.slice(0, -1)
    isOverflowed = true
  }


  if (!isOverflowed) {
    while (text[(text.length - 1)].trim() === '--' || text[(text.length - 1)].trim().startsWith('#')) {
      text = text.slice(0, -1)
    }
  }

  // -------------------
  
  let categories = []
  try {
    // categories = $.find('link[rel="alternate"][type="text/html"][href]:first').attr('href')
    let html = $.html()
    html = html.slice(0, html.indexOf('<title '))
    let parts = html.split(`<category scheme="http://www.blogger.com/atom/ns#" term="`)
    for (let i = 1; i < parts.length; i++) {
      let term = parts[i].slice(0, parts[i].indexOf('"'))
      if (term.indexOf('/') > -1) {
        term = term.slice(term.lastIndexOf('/') + 1).trim()
      } 
      categories.push(term)
    }

    categories = categories.filter((v, i, a) => a.indexOf(v) === i)

    if (categories.length > 0) {
      text.push('\n--\n#' + categories.join(' #'))
    }
  }
  catch (e) {
    // categories = e.toString()
  }


  // -----------------

  while (text[(text.length - 1)].trim().startsWith('----') || 
    text[(text.length - 1)].trim().startsWith('#') || 
    text[(text.length - 1)].trim().startsWith('[URL: ')) {
    text = text.slice(0, -1)
  }
  
  // -------------------

  text = text.filter(t => (t + '').trim() !== '')

  text = text.join('\n<br />')
  //console.log(text)

  // text = '<textarea>' + $.html() + '</textarea>' + text
  // text = code + '|' + text
  return text
}

module.exports = async function () {
  let $ = await GetHTML(`https://blog.pulipuli.info/feeds/posts/default`, {
    crawler: 'xml'
  })

  // console.log('not ok')

  FixThumbnail($)
  TravelContents($, modifyContent)

  SaveXML($, outputFilename)
}