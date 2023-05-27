const FeedSimple = require('./blog.pulipuli.info/FeedSimple.js')
const FeedTiny = require('./blog.pulipuli.info/FeedTiny.js')
const FeedPinterest = require('./blog.pulipuli.info/FeedPinterest.js')

let main = async () => {
  await FeedSimple()
  // await FeedTiny()
  await FeedPinterest()
}
main()

