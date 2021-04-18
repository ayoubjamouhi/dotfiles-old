/* global $, chrome */
const csCall = (fName, fArgs) => {
  return new Promise(res => {
    chrome.runtime.sendMessage({ type: 'csCall', fName, fArgs }, x => res(x))
  })
}

const content = (myOptions, config) => {
  const html = `
  <div class="mainapp">
    <div class="left">
      <div class="phone">
        <div id="insta">

        </div>
      </div>
    </div>
    <div class="right">
      <h1>Desktopify</h1>
      <ul class="options">
        <li>
          <span class="option">
            <i class="fa fa-external-link"></i> Full format photo link
          </span>
          <div class="onoffswitch">
            <input ${myOptions.extphotoButton ? 'checked' : ''}
              type="checkbox" name="extphotoButton" class="switch-input" id="extSwitch">
            <label class="switch-label" for="extSwitch">
              <span class="toggle--on">On</span><span class="toggle--off">Off</span>
            </label>
          </div>
        </li>
        <li>
          <span class="option">
            <i class="fa fa-download"></i> Download photo button
          </span>
          <div class="onoffswitch">
            <input ${myOptions.dlphotoButton ? 'checked' : ''}
              type="checkbox" name="dlphotoButton" class="switch-input" id="dlSwitch">
            <label class="switch-label" for="dlSwitch">
              <span class="toggle--on">On</span><span class="toggle--off">Off</span>
            </label>
          </div>
        </li>
      </ul>

    </div>
  </div>
`

  function injectMainFrame() {
    $('#insta')
      .empty()
      .append($('<iframe id="mainframe" src="https://www.instagram.com"></iframe>'))
  }

  $('header').remove()
  $('body').append(html)
  $(document).on('change', '.options [class="switch-input"]', async function() {
    const value = $(this).is(':checked')
    const name = $(this).prop('name')

    await csCall('setOption', [name, value])
  })

  injectMainFrame()
  $('body').append(
    `<div id="ext-settings-ok" data-version="${config.version}" data-debug="${config.debug}"></div>`
  )
}

const run = async () => {
  const config = await csCall('getConfig')
  const options = await csCall('getOptions')

  setTimeout(() => content(options, config), 1000)
}

run()
  .then(() => {})
  .catch(err => {
    console.log('err', err)
  })
