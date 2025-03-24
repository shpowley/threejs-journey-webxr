import { signal } from '@preact/signals-react'

// https://preactjs.com/guide/v10/signals/
// "reactive primitives for managing application state"
const SIGNALS = {
  atmosphere_color: {
    day: signal('#00aaff'),
    night: signal('#ff6600')
  },

  sun_angle: {
    phi: signal(Math.PI * 0.5),   // polar angle
    theta: signal(5.5)            // equatorial angle (originallly 0.5)
  }
}

const PIXEL_RATIO = Math.min(window.devicePixelRatio, 2)

export { SIGNALS, PIXEL_RATIO }