if (window.innerWidth < 500) {
  // view "mobile" version of website
  const spoofNavigator = {
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    vendor: 'Apple, Inc.',
    platform: 'iPhone'
  }

  document.addEventListener(
    'beforeload',
    function(e) {
      Object.keys(spoofNavigator).forEach(k => {
        Object.defineProperty(window.navigator, k, {
          get: function() {
            return spoofNavigator[k]
          }
        })
      })
    },
    true
  )

  const a = document.createElement('script')
  a.type = 'text/javascript'
  a.innerText = Object.keys(spoofNavigator)
    .map(
      k =>
        `Object.defineProperty(window.navigator, '${k}', { get: function(){ return '${
          spoofNavigator[k]
        }'; } });`
    )
    .join('')

  document.documentElement.insertBefore(a, document.documentElement.firstChild)
}
