const fs = require('fs')
const Papa = require('papaparse')
const RSSParserMain = require('rss-parser');
let RSSparser = new RSSParserMain();

const Feed = require('feed').Feed;

const GetHTML = require('./lib/GetHTML.js')
const $ = require('./lib/jQuery.js')

const extract = require('@extractus/feed-extractor').extract;

let main = async () => {
  /*
  let html = await GetHTML(`https://blog.pulipuli.info`)

  let $html = $(html)

  let titles = []
  $html.find('h1.entry-title').each((i, ele) => {
    titles.push($(ele).text().trim())
  })

  titles = JSON.stringify(titles, null, 2)

  fs.writeFileSync('output/output.json', titles)
  */

  /*
  let inputFeed = await RSSparser.parseURL('https://blog.pulipuli.info/feeds/posts/default');

  inputFeed.feedLinks = {
    atom: inputFeed.feedUrl
  }

  // console.log(feed)
  // console.log(feed.title);

  // feed.items.forEach(item => {
  //   console.log(item.title + ':' + item.link)
  // });
  const outputFeed = new Feed(inputFeed)

  inputFeed.items.forEach(item => {
    // console.log(item.title + ':' + item.link)
    outputFeed.addItem({
      title: item.title,
      id: item.id,
      link: item.link,
      content: item.content,
      date: new Date(item.pubDate),
    })
  });

  // console.log(feed.atom1());
  fs.writeFileSync('output/default.rss', outputFeed.atom1())
  fs.writeFileSync('output/default.json', JSON.stringify(inputFeed, null, 2))
  */

  let json = await extract('https://blog.pulipuli.info/feeds/posts/default', {
    useISODateFormat: false
  })
  console.log(json)
}
main()
