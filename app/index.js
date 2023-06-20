const FeedSimple = require('./blog.pulipuli.info/FeedSimple.js')
const FeedTiny = require('./blog.pulipuli.info/FeedTiny.js')
const FeedPinterest = require('./blog.pulipuli.info/FeedPinterest.js')
const FeedGist = require('./blog.pulipuli.info/FeedGist.js')

let main = async () => {
  await FeedSimple()
  await FeedTiny()
  await FeedPinterest()
  await FeedGist()
}
main()

