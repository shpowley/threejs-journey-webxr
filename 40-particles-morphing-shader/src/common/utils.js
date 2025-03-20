const
  XR_URL = 'https://threejs-journey-morph-webxr.vercel.app',
  USER_AGENT = navigator.userAgent.toLowerCase(),
  URL_PARAMS = new URLSearchParams(window.location.search)

const DEVICE = {
  isTouchDevice: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,

  isOculus: () => /oculusbrowser/.test(USER_AGENT),

  isAppleVisionPro: () => /ipad/.test(USER_AGENT) &&
    navigator.maxTouchPoints === 0 &&
    "xr" in navigator,

  isMobile: () => /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(USER_AGENT) && DEVICE.isTouchDevice(),

  isAppleMobile: () => /iphone|ipad/.test(USER_AGENT) && DEVICE.isTouchDevice(),

  isHeadset: () => DEVICE.isOculus() || DEVICE.isAppleVisionPro(),

  isDesktop: () => !DEVICE.isMobile() && !DEVICE.isHeadset(),

  isXR: () => ("xr" in navigator)
}

const openDialog = dialog => {
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

const closeDialog = dialog => {
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
const metaQuestWebLaunch = () => {
  let quest_url = new URL('https://oculus.com/open_url/')
  quest_url.searchParams.set('url', XR_URL)
  window.open(quest_url).focus()
}

// similar strategy as meta quest web launch
// https://play.eyejack.xyz/#home
const appClipLaunch = () => {
  let quest_url = new URL('https://play.eyejack.xyz/link/')
  quest_url.searchParams.set('url', XR_URL)
  window.open(quest_url, '_self')
}

// DETECT FULLSCREEN TAKING INTO ACCOUNT CHROME DESKTOP (F11 KEY / "FULL SCREEN" MENU)
// https://chatgpt.com/share/6772be20-e3c8-800f-a939-37b34d4dfe4d
const WINDOW_MODE = {
  NORMAL: 1,
  FULLSCREEN_API: 2,
  FULLSCREEN_BROWSER: 3
}

const getWindowMode = () => {
  if (document.fullscreenElement !== null)
    return WINDOW_MODE.FULLSCREEN_API
  else if (window.innerHeight === screen.height && window.innerWidth === screen.width)
    return WINDOW_MODE.FULLSCREEN_BROWSER
  else
    return WINDOW_MODE.NORMAL
}

const toggleFullscreen = () => {
  getWindowMode() === WINDOW_MODE.FULLSCREEN_API ?
    document.exitFullscreen() :
    document.documentElement.requestFullscreen()
}

export {
  DEVICE,
  openDialog, closeDialog,
  appClipLaunch, metaQuestWebLaunch,
  WINDOW_MODE, getWindowMode, toggleFullscreen
}