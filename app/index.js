const fs = require('fs')
const GetHTML = require('./lib/GetHTML.js')
const cheerio = require('cheerio')
const htmlentities = require('htmlentities')

// const textLimit = 5000
const textLimit = 1000

let main = async () => {
  let xml = await GetHTML(`https://blog.pulipuli.info/feeds/posts/default`, {
    crawler: 'fetch'
  })

  const $ = cheerio.load(xml, {
    xmlMode: true
  });
  
  // Modify elements using jQuery-style syntax
  await modifyHTML($)
  
  // Export modified XML as HTML code
  const modifiedHtml = $.xml();
  // modifiedHtml = modifiedHtml.replace(//g, '')
  
  // Write the modified XML as HTML to a file
  fs.writeFileSync('output/simple.rss', modifiedHtml, 'utf8');
  fs.writeFileSync('output/simple-20230527-0531.rss', modifiedHtml, 'utf8');
}
main()


async function modifyHTML($) {
  // $('media\\:thumbnail').attr('url', 'AAAAAAAAAAAAAA')

  let thumbnails = $(`media\\:thumbnail[url$="=s72-c"][height="72"][width="72"]`)
  for (let i = 0; i < thumbnails.length; i++) {
    let thumbnail = thumbnails.eq(i)
    
    thumbnail.removeAttr('height')
    thumbnail.removeAttr('width')
    let url = thumbnail.attr('url')
    url = url.slice(0, -6)
    thumbnail.attr('url', url)
  }

  // $('entry').each((index, entry) => {
  //   let $entry = cheerio.load(entry)

  //   let url = ''
  //   try {
  //     url = $entry('link[rel="alternate"][type="text/html"][href]:first').attr('href')
  //   }
  //   catch (e) {
  //     url = e
  //   }

  //   let title = ''
  //   try {
  //     title = $entry('link[rel="alternate"][type="text/html"][href]:first').attr('title')
  //   }
  //   catch (e) {
  //     title = e
  //   }

  //   // console.log($entry('content').html())
  //   let content = $entry('content').html()
  //   content = htmlentities.decode(content)

  //   let text = modifyContent($, content, url, title)
  //   // console.log(text)    
  //   // $entry('content').html(text)
  // })
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
    // console.log($entry('content').html())
    let text = modifyContent($, content, url, title)
    // console.log(text)
    // text = 'AAAAAAAAAAAAAA'
    $(`entry:eq(${i}) content`).text(text)
    // console.log($(`entry:eq(${i}) content`).html())
  }

  // $('entry > content').each((index, element) => {
    // let html = $(element).html();
    // html = htmlentities.decode(html)
    // // console.log(html)
    // let text = modifyContent($, html)

    // $(element).text(text)
  // });
}

function modifyContent($, content, url, title) {
  

  // ---------------

  let container = cheerio.load(content);
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

  if (!isOverflowed) {
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
      text.push('\n<br />----\n<br />#' + categories.join(' #'))
    }
  }
  catch (e) {
    // categories = e.toString()
  }


  // -----------------

  if (!isOverflowed) {
    while (text[(text.length - 1)] === '----' || text[(text.length - 1)].startsWith('#')) {
      text = text.slice(0, -1)
    }

    text.push('----\n<br />\n<br />看看網頁版全文 ⇨ ' + title + '\n<br />' + url)
    // text.push('看看網頁版全文 ⇨ ' + title + '\n<br />')
  }
  else {
    text.push('----\n<br />\n<br />繼續閱讀 ⇨ ' + title + '\n<br />' + url)
    // text.push('繼續閱讀 ⇨ ' + title + '\n<br />')
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
  text.unshift(img.prop('outerHTML'))

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

  text = text.join('\n<br />')
  //console.log(text)

  // text = '<textarea>' + $.html() + '</textarea>' + text
  // text = code + '|' + text
  return text
}

