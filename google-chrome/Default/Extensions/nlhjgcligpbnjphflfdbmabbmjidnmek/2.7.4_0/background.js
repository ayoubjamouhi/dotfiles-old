/* global chrome */

// For dev purpose, add "http://localhost:3042/*" on permissions and matches

const DEV = false

const Logger = {
  log() {
    if (DEV) {
      console.log.apply(null, arguments)
    }
  },
}

window.getConfig = () => ({
  version: '2.7.4',
  endpoint: DEV
    ? 'http://localhost:3042/instadesktop'
    : 'https://desktop-for-ig.devanco.com/instadesktop',
  appurl: DEV
    ? 'http://localhost:3042/instadesktop/app3'
    : 'https://desktop-for-ig.devanco.com/app3',
  debug: DEV,
})

function openTab(url) {
  chrome.browserAction.setBadgeText({ text: '' }) // reset notif counter
  chrome.tabs.create({ url }, (tab) => {
    myTabId = tab.id
    Logger.log('openTab', myTabId, tab)
  })
}

let myTabId = null

const requestFilter = {
  urls: ['https://*.instagram.com/*'],
}

const iphoneUa =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // -1 ??? bug in chrome 62
    if (details.tabId && (details.tabId === myTabId || details.tabId === -1)) {
      const { requestHeaders } = details

      requestHeaders.forEach((header) => {
        if (header.name === 'User-Agent') {
          header.value = iphoneUa
        }
      })

      const headers = requestHeaders.filter((header) => {
        return header.name.toLowerCase() !== 'referer'
      })

      return { requestHeaders: headers }
    }
  },
  requestFilter,
  ['blocking', 'requestHeaders']
)

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    // to be able to add iframe instagram in a mobile frame wrapper
    const toBeRemoved = [
      'x-frame-options',
      'content-security-policy-report-only',
      'content-security-policy',
    ]
    // only on extension context for security
    if (details.tabId && (details.tabId === myTabId || details.tabId === -1)) {
      const headers = details.responseHeaders.filter((header) => {
        return toBeRemoved.indexOf(header.name.toLowerCase()) === -1
      })

      // Desktopify use an iframe to display Instagram, so we need to be able to send Cookie with this iframe
      headers.forEach((header) => {
        if (header.name.toLowerCase() === 'set-cookie') {
          header.value = header.value.replace('Secure', 'SameSite=None; Secure')
        }
      })

      return {
        responseHeaders: headers,
      }
    }
  },
  requestFilter,
  ['blocking', 'responseHeaders', 'extraHeaders']
)

chrome.browserAction.onClicked.addListener(() => {
  const url = window.getConfig().appurl
  if (myTabId !== null) {
    chrome.tabs.remove(myTabId, () => {
      if (chrome.runtime.lastError) {
        /* tab already not exist */
      }
      openTab(url)
    })
  } else {
    openTab(url)
  }
})

if (chrome.runtime && chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL(`${window.getConfig().endpoint}/uninstall`)
}

window.getOptions = () => {
  const defaultOptions = {
    extphotoButton: true,
    dlphotoButton: true,
    internal_first: Date.now(),
    internal_count: 0,
    internal_rating: null,
  }

  const saved = localStorage.getItem('options')

  return saved === null
    ? defaultOptions
    : Object.assign(defaultOptions, JSON.parse(localStorage.getItem('options')))
}

window.setOption = (name, value) => {
  const options = window.getOptions()
  options[name] = value

  localStorage.setItem('options', JSON.stringify(options))

  chrome.tabs.sendMessage(myTabId, { name: 'set_options', value: options })
}

window.getInstaData = async () => {
  const ret = {
    connected: true,
    notifCount: 0,
  } // in case of regex don't work anymore !

  const response = await fetch('https://www.instagram.com', { credentials: 'include' })
  const html = await response.text()

  if (/activity_counts.{0,4}null/.test(html)) {
    ret.connected = false
  } else {
    const matches = html.match(/activity_counts[^{]*({[^}]*})/)
    if (matches && matches.length > 1) {
      try {
        const json = JSON.parse(matches[1])
        ret.notifCount = Object.keys(json).reduce((acc, k) => json[k] + acc, 0)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return ret
}

window.setTabId = (id) => {
  myTabId = id
}

function reload() {
  chrome.tabs.remove(myTabId, () => {
    if (chrome.runtime.lastError) {
      /* tab already not exist */
    }
    openTab(window.getConfig().appurl)
  })
}

chrome.runtime.onMessage.addListener((message, sender, send) => {
  if (message === 'reload') {
    reload()
  } else if (
    message === 'get_options' &&
    sender.tab &&
    (sender.tab.id === myTabId || myTabId === -1)
  ) {
    send({
      options: window.getOptions(),
      config: window.getConfig(),
    })
  } else if (message && message.type === 'csCall') {
    // calls from Content-Script
    Logger.log('csCall', message, sender)
    const { fName, fArgs } = message

    switch (fName) {
      case 'getConfig':
      case 'getOptions':
      case 'setOption':
        send(window[fName].apply(null, fArgs))
        break

      case 'getInstaData':
        window[fName].apply(null, fArgs).then((asyncResult) => {
          send(asyncResult)
        })
        return true // to not close channel communication asynchrounous send

      default:
        send(false)
        break
    }
  } else {
    Logger.log('other event', message, sender)
  }
})

Logger.log('started')
