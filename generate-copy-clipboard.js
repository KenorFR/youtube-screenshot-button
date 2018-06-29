// ==UserScript==
// @name        Youtube Screenshot Button
// @author      Amio
// @version     1.0.3
// @description Adds a button that lets you take screenshot.
// @homepageURL https://github.com/amio/youtube-screenshot-button
// @match       http://www.youtube.com/*
// @match       https://www.youtube.com/*
// @run-at      document-end
// @license     MIT License
// ==/UserScript==

function insertScreenshotButton () {
  var video = document.querySelector('.html5-main-video')
  var controls = document.querySelector('.ytp-right-controls')
  var existingButton = document.querySelector('.ytp-screenshot')

  if (existingButton) {
    console.info('Screenshot button already exists.')
    return
  }

  if (video && controls) {
    var buttonHTML = `
      <button id="ss-btn" class="ytp-button ytp-screenshot" title="Screenshot">
        <svg viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFF" fill-rule="evenodd"
            d="M16 0v10H0V0h16zM2 2h12v6H2V2zm0 6h3v2H2V8zm9-8h3v2h-3V0z"></path>
        </svg>
        <style>
          .ytp-screenshot { vertical-align: top; text-align:center; }
          .ytp-screenshot svg { height: 25%; width: 50% }
        </style>
      </button>
    `
    controls.insertAdjacentHTML('afterbegin', buttonHTML)
    document.getElementById('ss-btn').addEventListener('click', function () {
      var image = createScreenshotFromVideo(video)
      // openImageInNewTab(image)
        copyTextToClipboard(image);
    })
  }
}

function createScreenshotFromVideo (video, config) {
  var canvas = document.createElement('canvas')
  canvas.width = video.clientWidth
  canvas.height = video.clientHeight

  var ctx = canvas.getContext('2d')
  ctx.fillRect(0, 0, canvas.width, canvas.height),
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  var mime = {
    png: 'image/png',
    jpg: 'image/jpeg'
  }[config && config.type || 'jpg']

  return canvas.toDataURL(mime)
}

function openImageInNewTab (dataURI) {
  var html = `<html><body><img src="${dataURI}"/></body></html>`
  var newTab = window.open('', 'large')

  newTab.document.open()
  newTab.document.write(html)
  newTab.document.close()
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function copyClipboardImage(dataURI) {
    console.log(dataURI);
    var text = dataURI;
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

function unload () {
  const btn = document.getElementById('ss-btn')
  btn.parentElement.removeChild(btn)
}

function SelectText(element) {
    var doc = document;
    var range;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

if (typeof window !== 'undefined') {
  insertScreenshotButton()
}

// export default insertScreenshotButton
// export { unload }
