import { signal } from '@preact/signals-react'

// https://preactjs.com/guide/v10/signals/
// "reactive primitives for managing application state"
const SIGNALS = {
  clear_color: signal('#160920'),
  color_A: signal('#ff7300'),
  color_B: signal('#0092ff'),
  progress: signal(0)
}

const PIXEL_RATIO = Math.min(window.devicePixelRatio, 2)

export { SIGNALS, PIXEL_RATIO }