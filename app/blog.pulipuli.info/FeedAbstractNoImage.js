// const textLimit = 5000
const textLimit = 300
const outputFilename = 'abstract-noimg-20250114-0556.rss'

// ---------

const GetHTML = require('../lib/GetHTML.js')
const FixThumbnail = require('./lib/FixThumbnail.js')
const TravelContents = require('./lib/TravelContents.js')

const SaveXML = require('../lib/SaveXML.js')

// ---------

let modifyContent = function ($, container, url, title) {

  let text = []
  let pList = container('p,hr,h2,h3,h4,ul,ol,pre,blockquote')
  let isOverflowed = false
  for (let i = 0; i < pList.length; i++) {
    let p = pList.eq(i)

    let tagName = p.prop('tagName').toLowerCase()
    if (tagName === 'p' && p.find('img').length > 0) {
      continue
    }
    else if (tagName === 'hr') {
      break
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

    if (tagName === 'h2') {
      t = '# ' + t
    }
    else if (tagName === 'h3') {
      t = '## ' + t
    }
    else if (tagName === 'h4') {
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
      while (text[(text.length - 1)] === '----' || text[(text.length - 1)].startsWith('#')) {
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

  if (!isOverflowed && text.length > 2) {
    // console.log(text)
    while (text[(text.length - 1)] === '----' || text[(text.length - 1)].startsWith('#')) {
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
      text.push('\n----\n#' + categories.join(' #'))
    }
  }
  catch (e) {
    // categories = e.toString()
  }


  // -----------------
  // console.log('url', url)
  if (!isOverflowed) {
    while (text[(text.length - 1)] === '----' || text[(text.length - 1)].startsWith('#')) {
      text = text.slice(0, -1)
    }

    // text.push('----\n<br />\n<br />看看網頁版全文 ⇨ ' + title + '\n<br />' + url)
    // text.push('看看網頁版全文 ⇨ ' + title + '\n<br />')
    // text.push('----\n\n看看網頁版全文 ⇨ ' + title + '\n')
    text.push('----\n\n看看網頁版全文 ⇨ ' + url + '\n')
  }
  else {
    // text.push('----\n<br />\n<br />繼續閱讀 ⇨ ' + title + '\n<br />' + url)
    // text.push('繼續閱讀 ⇨ ' + title + '\n<br />')
    // text.push('----\n\n繼續閱讀 ⇨ ' + title + '\n')
    text.push('----\n\n繼續閱讀 ⇨ ' + url + '\n')
  }
  
  // ------------
  
  
  let img = container('img:first')
  let imgSrc = img.attr('src')
  let sizePos = imgSrc.lastIndexOf('=s')
  if (sizePos > -1 && sizePos > imgSrc.length - 10) {
    imgSrc = imgSrc.slice(0, sizePos) + '=s1080'
    img.attr('src', imgSrc)
  }
  else {
    imgSrc = imgSrc + '=s1080'
    img.attr('src', imgSrc)
  }

  // imgSrc = typeof(img.length)

  // imgSrc = img.parent().prop('outerHTML')
  // imgSrc = img.eq(0).attr('src')
  // imgSrc = img.length
  // let img = $.find('img:first').parent()
  // text.unshift(img.prop('outerHTML'))

  text.unshift(`# ` + title + "\n")

  // ------------
  
  // try {
  //   let categories = $.find('category[scheme="http://www.blogger.com/atom/ns#"][term]')
  //   let terms = []
  //   text.push(categories.length)
  // }
  // catch (e) {
  //   text.push(e)
  // }
    
  // for (let i = 0; i < categories.length; i) {
  //   let term = categories[i].attr('term')
  //   if (term.indexOf('/') > -1) {
  //     term = term.slice(term.lastIndexOf('/') + 1).trim()
  //   }
  //   terms.push(term)
  // }

  // terms = terms.filter((v, i, a) => a.indexOf(v) === i)

  // if (terms.length > 0) {
  //   text.push('#' + terms.join(' #'))
  // }
  
  // -------------------

  text = text.filter(t => (t + '').trim() !== '')

  text = text.join('\n')
  // text = text.unshift((new Date()))
  // console.log("長度: " + text.length)

  // text = '<textarea>' + $.html() + '</textarea>' + text
  // text = code + '|' + text
  return text
}

module.exports = async function () {
  let $ = await GetHTML(`https://blog.pulipuli.info/feeds/posts/default?alt=rss`, {
    crawler: 'xml'
  })

  console.log("Processing: " + outputFilename)

  FixThumbnail($)
  TravelContents($, modifyContent)

  SaveXML($, outputFilename)
}
