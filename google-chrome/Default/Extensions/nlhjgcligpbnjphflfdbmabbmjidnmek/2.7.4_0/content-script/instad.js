/* global Image, $ */

window.InstaD = {
  extractDataFromArticle($article) {
    const plshort = $article
      .find('a time')
      .parent()
      .attr('href')
    return {
      permalink: $article
        .find('a time')
        .parent()
        .prop('href'),
      quote: $article.find('ul li:first>span>span').text(),
      plshort,
      priv: !plshort || plshort.length > 18
    }
  },

  linkUrl($img) {
    const $el = $img.parent().find('video').length > 0 ? $img.parent().find('video') : $img

    return $el.prop('src')
  },

  download(url, name) {
    const is_video = /\.mp4/.test(url)

    if (is_video) {
      let xhr = new XMLHttpRequest()
      xhr.overrideMimeType('application/octet-stream')
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let res = xhr.response
          if (res) {
            let byteArray = new Uint8Array(res)
            let blob = new Blob([byteArray.buffer])
            window.saveAs(blob, name)
            delete blob
          }
        }
      }
      xhr.send(null)
    } else {
      const src = `${url}${url.indexOf('?') === -1 ? '?' : '&'}_t=${Date.now()}`
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function() {
        const dlCanvas =
          $('#inb-dlb-canvas').length > 0
            ? $('#inb-dlb-canvas')[0]
            : $('<canvas id="inb-dlb-canvas" style="display:none" />').appendTo('body')[0]
        const { naturalWidth, naturalHeight } = this
        dlCanvas.setAttribute('width', naturalWidth)
        dlCanvas.setAttribute('height', naturalHeight)
        dlCanvas.getContext('2d').drawImage(img, 0, 0)
        dlCanvas.toBlob(blob => window.saveAs(blob, name, naturalWidth, naturalHeight))
      }
      img.src = src
    }
  }
}
