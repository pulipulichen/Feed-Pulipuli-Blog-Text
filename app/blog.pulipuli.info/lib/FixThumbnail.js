/**
 * 20230527-1705 ok RSS也通用 
 * @param {*} $ 
 */
module.exports = function ($) {
  let thumbnails = $(`media\\:thumbnail[url$="=s72-c"][height="72"][width="72"]`)
  for (let i = 0; i < thumbnails.length; i++) {
    let thumbnail = thumbnails.eq(i)
    
    thumbnail.removeAttr('height')
    thumbnail.removeAttr('width')
    let url = thumbnail.attr('url')
    url = url.slice(0, -6)
    thumbnail.attr('url', url)
  }
}