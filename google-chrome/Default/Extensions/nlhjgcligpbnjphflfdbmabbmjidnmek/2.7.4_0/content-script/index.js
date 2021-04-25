/* global $, chrome, screen, InstaD */
chrome.runtime.sendMessage('get_options', r => {
  if (r) {
    let options = r.options
    const { config } = r

    const Logger = {
      log() {
        if (config.DEBUG) {
          console.log.apply(null, arguments)
        }
      }
    }

    chrome.runtime.onMessage.addListener(({ name, value }) => {
      if (name === 'set_options') options = value
    })

    $(() => {
      if ($('body').length) {
        $('body').append(`
          <style media="screen">
            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-thumb {
              background-color: #e1e1e1;
            }

            ::-webkit-scrollbar-track {
              background: transparent;
              border-left: 1px solid #dedede;
            }
          </style>
        `)
      }

      function imageAcceptAll() {
        $('input[type="file"][accept="image/jpeg"]').attr('accept', 'image/*')
      }

      function removeAppPromote() {
        if ($('a:contains("×")').length) {
          $('a:contains("×")')
            .parent()
            .remove()
        }

        if ($('a[href^="https://itunes.apple.com/app/instagram"]').length) {
          $('a[href^="https://itunes.apple.com/app/instagram"]').remove()
        }
      }

      function injectStyle() {
        if ($('.ind-fa-link').length === 0) {
          $('body').append(`
            <link class="ind-fa-link" rel="stylesheet" crossorigin="anonymous"
              href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
              integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN">
          `)
        }
      }

      function pop(href, w, h) {
        const left = Number(screen.width / 2 - w / 2)
        const top = Number(screen.height / 2 - h / 2)
        const win = window.open(
          href,
          '',
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=1, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
        )
        win.focus()
      }

      $(document).on('click', '.inb-ext-el', e => {
        window.top.postMessage({ action: 'log_event', event: 'CONTENT_EXTB' }, '*')
      })
      function extButton() {
        if (options.extphotoButton) {
          const $ctns = $(':not(header):not(a) > div > div > img:not([data-inb-ext="1"])')
          $ctns.each(function() {
            const $img = $(this)
            $img
              .attr('data-inb-ext', '1')
              .closest('article')
              .find('div[role*="button"]:eq(1)')
              .append(
                $(`
                  <a href="${InstaD.linkUrl($img)}" target="_blank" 
                    rel="noopener noreferrer"
                    class="inb-photo-el inb-ext-el">
                    <i class="fa fa-external-link"></i>
                  </a>
                `)
              )
              .addClass('inb-photo-ctn')
          })
        } else {
          $('.inb-ext-el').remove()
          $('[data-inb-ext="1"]').attr('data-inb-ext', null)
        }
      }

      $(document).on('click', '.inb-dlb-el', function(e) {
        e.preventDefault()

        const url = $(this).data('href')
        const name = url
          .split('?')[0]
          .split('/')
          .pop()
        window.top.postMessage({ action: 'log_event', event: 'CONTENT_DLB' }, '*')
        InstaD.download(url, name)
      })

      function dlButton() {
        if (options.dlphotoButton) {
          const $ctns = $(':not(header):not(a) > div > div > img:not([data-inb-dlb="1"])')
          $ctns.each(function() {
            const $img = $(this)
            $img
              .attr('data-inb-dlb', '1')
              .closest('article')
              .find('div[role*="button"]:eq(1)')
              .append(
                $(`
                  <a href="#" data-href="${InstaD.linkUrl($img)}"
                    class="inb-photo-el inb-dlb-el"><i class="fa fa-download"></i></a>
                `)
              )
              .addClass('inb-photo-ctn')
          })
        } else {
          $('.inb-dlb-el').remove()
          $('[data-inb-dlb="1"]').attr('data-inb-dlb', null)
        }
      }

      function loop() {
        injectStyle()
        imageAcceptAll()
        removeAppPromote()
        extButton()
        dlButton()
      }

      loop()
      setInterval(loop, 1000)

      window.onmessage = function(m) {
        if (m && m.data && m.data.type === 'proxyCall') {
          Logger.log('CS', 'message from MAIN frame -> bg', m)
          chrome.runtime.sendMessage(m.data, res => {
            Logger.log('CS', 'response from bg -> MAIN', res)
            window.top.postMessage({ id: m.data.id, data: res }, '*')
          })
        }
      }

      $(document).on('click', '.coreSpriteCloseLight', () => {
        chrome.runtime.sendMessage('reload')
      }) // story close ..
    })
  }
})
