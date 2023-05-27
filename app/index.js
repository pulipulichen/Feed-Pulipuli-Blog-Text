const FeedSimple = require('./blog.pulipuli.info/FeedSimple.js')
const FeedTiny = require('./blog.pulipuli.info/FeedTiny.js')

let main = async () => {
  await FeedSimple()
  await FeedTiny()
}
main()

