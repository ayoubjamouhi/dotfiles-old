// Global variable for mobile Play Store detection
const ifMobileSite = !!document.querySelector('meta[name="mobile-web-app-capable"]')

// Global variable for pre-registration detection
const ifPreregistration = !!document.querySelector('not-preregistered,preregistered')

// Function for printing messages in the JS console
function log(message) {
  console.log('%c[Toolbox] ' + message, 'color: #673AB7')
}

// Function for checking if current page is a Play Store app page
function ifAppPage() {
  if (window.location.href.includes('/store/apps/details') && window.location.href.includes('id=')) {
    return true
  } else {
    return false
  }
}

// Function for obtaining the current active page
function getActiveContainer() {
  // Every time the user navigates, a new <c-wiz> element is created with all the page content
  // This finds the <c-wiz> element currently visible to the user
  try {
    var container = document.querySelector('c-wiz[data-ogpc]:last-of-type')
    return container
  } catch {
    return null
  }
}

// Function for checking if the buttons are already injected AND visible to the user
function ifButtonsExist() {
  try {
    var buttonsExist = getActiveContainer().querySelector('.toolbox-extension-container')
    return buttonsExist
  } catch {
    return null
  }
}

// Function for finding short app name
function getAppName() {
  var title = document.title
  title = title.substring(0, title.lastIndexOf("-") - 1)
  // If the processed title string is blank (possible if google changes the title format), return generic label
  if (title) {
    return title
  } else {
    return 'this app'
  }
}

// Function for retrieving parameters from URLs, used for grabbing 'authuser' variable and app package name
// Credit: https://stackoverflow.com/a/901144/2255592
function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href
  }
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// Function to find difference in hours/days between two Date() objects
function timeDiff(dt2, dt1, format) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000
  diff /= (60 * 60)
  if (format == 'hours') {
    return Math.abs(Math.round(diff))
  } else if (format == 'days') {
    return Math.abs(Math.round(diff)) / 24
  }
}

// Functions for triggering clicks on items loaded through AJAX
// Source: https://stackoverflow.com/a/15512019
function triggerMostButtons(jNode) {
  triggerMouseEvent(jNode, 'mouseover')
  triggerMouseEvent(jNode, 'mousedown')
  triggerMouseEvent(jNode, 'mouseup')
  triggerMouseEvent(jNode, 'click')
}

function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent(eventType, true, true)
  node.dispatchEvent(clickEvent)
}

// Promise object for retrieving info about an app package from storage or APKMirror API
function getAppInfo(packageName) {
  return new Promise(function (resolve, reject) {
    // Check chrome.storage cache first
    console.log('Checking cache for data about ' + packageName + '...')
    chrome.storage.local.get({
      // Create cache array if it does not exist
      apkCache: []
    }, async function (storage) {
      // Clean out cache if it gets too large
      if (storage.apkCache.length >= 500) {
        console.log('Clearing out cache...')
        storage.apkCache = []
      }
      // Check if cache contains results for packageName
      if (storage.apkCache.find(el => el[0] === packageName)) {
        console.log('Found app in cache:', storage.apkCache.find(el => el[0] === packageName))
        var cachedate = new Date(storage.apkCache.find(el => el[0] === packageName)[1][0])
        var start = new Date()
        var daydiff = timeDiff(cachedate, start, 'days') // Difference between cache date and now in days
        var hourdiff = timeDiff(cachedate, start, 'hours') // Difference between cache date and now in hours
        // Determine if the cache needs to be updated
        // If app is already in cache with value of TRUE (app exists on APKM), wait 8 hours before checking again
        // If app is already in cache with value of FALSE (app does not exist on APKM), wait three hours before checking again
        // If app is not in cache at all, check APKMirror and store result
        if (((storage.apkCache.find(el => el[0] === packageName)[1][0] == true) && hourdiff > 7) || ((storage.apkCache.find(el => el[0] === packageName)[1][1].exists == false) && hourdiff > 2)) {
          console.log('Cache info is out of date (info is from ' + cachedate + ', ' + hourdiff + ' hours ago), checking APKMirror.')
          var appData = await checkAPKMirror(packageName, storage)
          resolve(appData)
        } else {
          console.log('Cache data is only from from ' + hourdiff + ' hours (' + daydiff + ' days) ago, no need to check APKMirror.')
          // Create APKMirror Button
          resolve(storage.apkCache.find(el => el[0] === packageName)[1][1])
        }
      } else {
        console.log('Did not find ' + packageName + ' in cache, checking APKMirror...')
        var appData = await checkAPKMirror(packageName, storage)
        resolve(appData)
      }
    })
  })
}

// Function for interacting with APKMirror API
function checkAPKMirror(packageName, storage) {
  return new Promise(function (resolve, reject) {
    // Prepare JSON data
    chrome.runtime.sendMessage({ contentScriptQuery: 'checkAPKMirror', pname: packageName.toString() }, function (data) {
      // If there's an API error, return an empty string
      if (!data) {
        resolve({})
      } else {
        var app = data.data[0]
        // console.log('APKMirror API results:', app)
        // Remove existing entry from cache, if one exists
        var index = storage.apkCache.indexOf(storage.apkCache.find(el => el[0] === packageName))
        if (index > -1) {
          storage.apkCache.splice(index, 1)
        }
        // Add new entry to cache
        var currentTime = Date().toString()
        storage.apkCache.push([app.pname, [currentTime, app]])
        // Save array back to chrome.storage
        chrome.storage.local.set({
          // Create cache array if it does not exist
          apkCache: storage.apkCache
        }, function () {
          // Cache file saved
        })
        // Resolve Promise
        resolve(app)
      }
    })
  })
}

// Function for checking for Play Store beta programs
function checkTestingProgram(testingButton) {
  // Find which Google account (authuser) is currently logged in by scanning page for links with authuser parameter
  try {
    var authuser = getParameterByName('authuser', document.querySelector('a[href*="authuser"]').getAttribute('href'))
  }
  catch (err) {
    var authuser = null
  }
  // If the authuser couldn't be found, use zero
  if (authuser === null) {
    authuser = 0
    console.log('Authuser could not be detected, defaulting to 0')
  } else {
    console.log('Detected authuser as ' + authuser)
  }
  // Generate link for testing program with package name and authuser result
  var testingProgramLink = 'https://play.google.com/apps/testing/' + getParameterByName('id', window.location.href) + '?authuser=' + authuser + '&hl=en'
  // Set parameters for fetch request
  var fetchInit = {
    method: 'GET',
    headers: {
      'Accept': 'text/html',
      'Content-Type': 'text/html'
    },
    cache: 'default'
  }
  // Open testing program page when button is clicked, regardless of final result
  testingButton.addEventListener('click', function () {
    window.location.href = testingProgramLink
  })
  // Make API call
  fetch(testingProgramLink, fetchInit)
    .then(function (response) {
      if (!response.ok) {
        console.log('No testing program detected, or user is logged out. Removing testing program button.')
        testingButton.remove()
        return
      }
      // The response is a promise that returns when the data is retrieved
      response.text().then(function (data) {
        console.log('Received response from app testing page: ' + testingProgramLink)
        // Create a beta test message
        if (data.includes('You are a tester')) {
          testingButton.innerHTML = '<button>Enrolled in beta</button>'
          testingButton.title = 'You are enrolled in the testing program for ' + getAppName() + ', click for more information or to leave the testing program'
          testingButton.classList.add('testing-enabled-button')
        } else if (data.includes('Become a tester')) {
          testingButton.innerHTML = '<button>Join beta</button>'
          testingButton.title = 'A testing program for ' + getAppName() + ' is available, click to see more information'
          testingButton.classList.add('testing-enabled-button')
        } else {
          testingButton.innerHTML = '<button>No beta</button>'
          testingButton.title = 'A testing program for ' + getAppName() + ' is not available for this Google account, click to see to see more information.'
        }
      })
    })
    .catch(function () {
      console.log('No testing program detected, or user is logged out. Removing testing program button.')
      testingButton.remove()
      return
    });
}

// Function for injecting all buttons and messages
async function insertElements() {
  console.log('Running insertElements function...')
  var packageName = getParameterByName('id', window.location.href)
  // Inject the container
  if (ifMobileSite) {
    // App is live (mobile Play Store)
    var buttonContainer = document.createElement('div')
    buttonContainer.className = 'toolbox-extension-container'
    var parentContainer = getActiveContainer().querySelector('main c-wiz:nth-child(1) c-wiz:nth-child(1) div:nth-child(1) div:nth-child(1)')
    if (!ifButtonsExist()) {
      parentContainer.append(buttonContainer)
    }
  } else {
    // App is live (desktop Play Store)
    var buttonContainer = document.createElement('div')
    buttonContainer.className = 'toolbox-extension-container'
    // This is the DIV that contains the app name, rating, rating, etc
    // Visual aid: https://i.imgur.com/CkY1rRp.png
    var parentContainer = getActiveContainer().querySelector('main c-wiz:nth-child(1) c-wiz:nth-child(1) div:nth-child(1) div:nth-child(2)')
    if (!ifButtonsExist()) {
      parentContainer.append(buttonContainer)
    }
  }
  chrome.storage.local.get({
    // Set variables if they do not exist
    settings: {
      apkmirror: true,
      androidpolice: true,
      appbrain: true,
      testing: true,
      screenshot: true
    }
  }, async function (data) {
    // Add shortcut for extension settings, but only if it's not already there, and only for mobile
    if (ifMobileSite && (!(getActiveContainer().querySelector('.toolbox-settings-toolbar')))) {
      // Create shortcut element
      var settingsDiv = document.createElement('div')
      settingsDiv.className = 'toolbox-settings-toolbar'
      var SettingsDivContent = document.createTextNode('Toolbox extension settings »')
      settingsDiv.appendChild(SettingsDivContent)
      // Insert shortcut element
      getActiveContainer().prepend(settingsDiv)
      // Open settings when the shortcut DIV is tapped
      settingsDiv.addEventListener('click', function () {
        window.open(chrome.extension.getURL('settings.html'))
        return false
      })
      console.log('Inserted extension settings shortcut.')
    }
    // Insert Appbrain button if enabled in settings
    if (data.settings.appbrain === true) {
      var appBrainButton = document.createElement('span')
      appBrainButton.className = 'toolbox-extension-button appbrain-button'
      appBrainButton.title = 'Open ' + getAppName() + ' on Appbrain'
      appBrainButton.innerHTML = '<button>AB</button>'
      buttonContainer.appendChild(appBrainButton)
      // Open app in Appbrain when Appbrain button is clicked
      appBrainButton.addEventListener('click', function () {
        window.open('http://www.appbrain.com/app/' + getParameterByName('id', window.location.href))
      })
    }
    // Insert Android Police button if enabled in settings
    if (data.settings.androidpolice === true) {
      var apButton = document.createElement('span')
      apButton.className = 'toolbox-extension-button ap-button'
      apButton.title = 'Search for ' + getAppName() + ' on Android Police'
      apButton.innerHTML = '<button>AP</button>'
      buttonContainer.appendChild(apButton)
      // Search for the app on Android Police when the AP button is clicked
      apButton.addEventListener('click', function () {
        window.open('http://www.androidpolice.com/?s=' + getParameterByName('id', window.location.href))
      })
    }
    // Insert APKMirror button
    if (data.settings.apkmirror === true) {
      var apkMirrorButton = document.createElement('span')
      apkMirrorButton.className = 'toolbox-extension-button apkmirror-button'
      apkMirrorButton.title = 'Checking ' + getAppName() + ' on APKMirror...'
      apkMirrorButton.innerHTML = '<button>Loading...</button>'
      buttonContainer.appendChild(apkMirrorButton)
      // Search for the app on APKMirror when the APKM button is clicked
      apkMirrorButton.addEventListener('click', function () {
        window.open('https://www.apkmirror.com/?s=' + getParameterByName('id', window.location.href) + '&post_type=app_release&searchtype=apk')
      })
      // Obtain app information from APKMirror API or cache
      var appData = await getAppInfo(packageName)
      if (Object.keys(appData).length === 0) {
        // Could not retrieve app info, so just display the button as enabled
        apkMirrorButton.classList.add('apkmirror-enabled-button')
        apkMirrorButton.innerHTML = '<button>APKM</button>'
        apkMirrorButton.title = 'Search for ' + getAppName() + ' on APKMirror'
      } else {
        if (appData.exists === true) {
          // App exists on APKM
          apkMirrorButton.classList.add('apkmirror-enabled-button')
          apkMirrorButton.innerHTML = '<button>APKM</button>'
          apkMirrorButton.title = ''
          apkUploadDate = appData.release.publish_date.split(' ')[0]
          tippy(apkMirrorButton, {
            content: 'Version ' + appData.release.version + ' (' + apkUploadDate + ')'
          })
        } else {
          // App does not exist on APKM
          apkMirrorButton.innerHTML = '<button>APKM</button>'
          apkMirrorButton.title = getAppName() + ' is not available on APKMirror'
        }
      }
    }
    // Add screenshot gallery scrollbar and keyboard shortcuts if Better screenshot gallery is enabled in settings
    // This is disabled on the mobile Play Store
    if ((data.settings.screenshot === true) && (!ifMobileSite)) {
      // Add scrollbar to inline gallery when it is added to the DOM
      // This has to be a forEach function to work on subsequent page navigations (because the previous screenshot gallery is still in the DOM)
      var waitForScreenshotGallery = setInterval(function () {
        if (getActiveContainer().querySelector('div[data-slideable-portion-heuristic-width]')) {
          clearInterval(waitForScreenshotGallery)
          // The screenshot gallery should be the second child DIV in the div[data-slideable-portion-heuristic-width] container
          var screenshotContainer = getActiveContainer().querySelectorAll('div[data-slideable-portion-heuristic-width]:first-of-type div:not([jsaction])')[1]
          screenshotContainer.classList.add('toolbox-extension-gallery')
          console.log('Better screenshot gallery is enabled.')
          // Hide left navigation arrow
          var leftScreenshotButton = getActiveContainer().querySelectorAll('div[data-slideable-portion-heuristic-width]:first-of-type div')[0]
          leftScreenshotButton.style.visibility = 'hidden'
          // Hide right navigation arrow
          var rightScreenshotButtonSelector = getActiveContainer().querySelectorAll('div[data-slideable-portion-heuristic-width]:first-of-type div')
          var rightScreenshotButton = rightScreenshotButtonSelector[rightScreenshotButtonSelector.length - 2] // The DIV for the right sreenshot button is the second element from the end of the querySelector
          rightScreenshotButton.style.visibility = 'hidden'
          // Add listener for left/right arrow keys
          document.addEventListener('keydown', function doc_keyUp(e) {
            // Only trigger actions if the lightbox is open
            if (e.keyCode == '37' && document.querySelector('div[role="dialog"]')) {
              // Get left and right arrow buttons in lightbox
              // This should return an array of three elements: the back arrow at the top of the screen (0), the left navigation button (1), and the right navigation button (2)
              var lightboxButtons = document.querySelectorAll('div[role="dialog"] div[jsaction][jsname]')
              // Left arrow
              try {
                var leftButton = lightboxButtons[1]
                triggerMostButtons(leftButton)
              } catch (err) {
                console.log('Error with navigation: ' + err)
              }
            } else if (e.keyCode == '39' && document.querySelector('div[role="dialog"]')) {
              // Get left and right arrow buttons in lightbox
              // This should return an array of three elements: the back arrow at the top of the screen (0), the left navigation button (1), and the right navigation button (2)
              var lightboxButtons = document.querySelectorAll('div[role="dialog"] div[jsaction][jsname]')
              // Right arrow
              try {
                var rightButton = lightboxButtons[2]
                triggerMostButtons(rightButton)
              } catch (err) {
                console.log('Error with navigation: ' + err)
              }
            }
          })
        }
      }, 100)
    }
    // If the testing program option is enabled in settings, insert the button for it
    if (data.settings.testing === true) {
      var testingButton = document.createElement('span')
      testingButton.className = 'toolbox-extension-button testing-button'
      testingButton.title = 'Checking for beta program...'
      testingButton.innerHTML = '<button>Loading...</button>'
      buttonContainer.appendChild(testingButton)
      // Perform network request for beta page
      console.log('Injected beta program button, waiting for Fetch response.')
      checkTestingProgram(testingButton)
    }
  })
}

// Run injection code
function main() {
  // Add class to <body> if we're on a mobile page
  if (ifMobileSite) {
    document.body.classList.add('toolbox-extension-mobile-site')
  }
  if (getActiveContainer() !== null) {
    // Continue with injection
    if (ifButtonsExist()) {
      console.log('Detected a page change, but injected code is already present.')
    } else if (ifAppPage()) {
      console.log('Detected a page change, injecting code again...')
      insertElements()
    } else {
      console.log('Detected a page change, but the new page does not appear to be an app page.')
    }
  } else {
    // If the container doesn't exist, wait for it to be added to the DOM
    var waitForContainer = setInterval(function () {
      if (getActiveContainer() !== null) {
        clearInterval(waitForContainer)
        // Continue with injection
        if (ifButtonsExist()) {
          console.log('Detected a page change, but injected code is already present.')
        } else if (ifAppPage()) {
          console.log('Detected a page change, injecting code again...')
          insertElements()
        } else {
          console.log('Detected a page change, but the new page does not appear to be an app page.')
        }
      }
    }, 100)
  }
}

// Run code after initial page has finished loading
if (document.readyState !== 'loading') {  // DOMContentLoaded has already fired
  main()
} else {  // Page isn't done loading
  document.addEventListener('DOMContentLoaded', function () {
    main()
  })
}

// Create a MutationObserver to run insertElements() whenever the Play Store loads a new app page
var pageobserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    main()
  })
})

// Set the MutationObserver to the <title> tag (which changes whenever the app page does)
pageobserver.observe(document.querySelector('title'), {
  childList: true
})