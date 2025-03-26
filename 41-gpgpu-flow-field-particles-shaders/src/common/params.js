import { signal } from '@preact/signals-react'

// https://preactjs.com/guide/v10/signals/
// "reactive primitives for managing application state"
const SIGNALS = {
  clear_color: signal('#29191f'),
  particle_size: signal(0.07),
  field_influence: signal(0.5),
  field_strength: signal(2),
  field_frequency: signal(0.5),
  debug_mesh: signal(false)
}

const PIXEL_RATIO = Math.min(window.devicePixelRatio, 2)

export { PIXEL_RATIO, SIGNALS }