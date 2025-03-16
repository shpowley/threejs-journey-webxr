const
  XR_URL = 'https://threejs-journey-morph-webxr.vercel.app',
  USER_AGENT = navigator.userAgent.toLowerCase()

function isMobileUserAgent() {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(USER_AGENT)
}

function isAppleUserAgent() {
  return /iphone|ipad/.test(USER_AGENT)
}

function isOculusUserAgent() {
  return /oculusbrowser/.test(USER_AGENT)
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}

function isMobile() {
  return isMobileUserAgent() && isTouchDevice()
}

function isAppleMobile() {
  return isAppleUserAgent() && isTouchDevice()
}

function openDialog(dialog) {
  dialog.style.display = 'flex'

  dialog
    .animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      {
        duration: 500,
        easing: 'ease-in-out',
      }
    )
    .onfinish = () => {
      dialog.style.opacity = 1
    }
}

function closeDialog(dialog) {
  dialog
    .animate(
      [
        { opacity: 1 },
        { opacity: 0 },
      ],
      {
        duration: 500,
        easing: 'ease-in-out',
      }
    )
    .onfinish = () => {
      dialog.style = null
    }
}

// https://developers.meta.com/horizon/documentation/web/web-launch/
function metaQuestWebLaunch() {
  let quest_url = new URL('https://oculus.com/open_url/')
  quest_url.searchParams.set('url', XR_URL)
  window.open(quest_url).focus()
}

// similar strategy as meta quest web launch
// https://play.eyejack.xyz/#home
function appClipLaunch() {
  let quest_url = new URL('https://play.eyejack.xyz/link/')
  quest_url.searchParams.set('url', XR_URL)
  window.open(quest_url, '_self')
}

export {
  isMobile,
  openDialog, closeDialog,
  isAppleMobile, appClipLaunch,
  isOculusUserAgent, metaQuestWebLaunch
}