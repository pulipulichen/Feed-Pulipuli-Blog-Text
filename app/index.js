const FeedSimple = require('./blog.pulipuli.info/FeedSimple.js')
const FeedTiny = require('./blog.pulipuli.info/FeedTiny.js')
const FeedPinterest = require('./blog.pulipuli.info/FeedPinterest.js')
const FeedGist = require('./blog.pulipuli.info/FeedGist.js')
const FeedThreads = require('./blog.pulipuli.info/FeedThreads.js')
const FeedAbstract = require('./blog.pulipuli.info/FeedAbstract.js')
const FeedAbstractNoImage = require('./blog.pulipuli.info/FeedAbstractNoImage.js')
// const t = require('../[trash/20230621-0130/t.js')

let main = async () => {
  await FeedSimple()
  await FeedTiny()
  await FeedPinterest()
  await FeedGist()
  await FeedThreads()
  await FeedAbstract()
  await FeedAbstractNoImage()
  // t()
}
main()

