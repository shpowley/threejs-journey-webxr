import { effect } from '@preact/signals-react'
import { useEffect } from 'react'
import { Pane } from 'tweakpane'

import { SIGNALS } from '../common/params'

const BUTTONS = {
  DONUT: 1,
  SUZANNE: 2,
  SPHERE: 3,
  THREEJS: 4
}

// https://tweakpane.github.io/docs/ (stand in for leva)
const TweakPaneControls = ({ onButtonClick }) => {
  useEffect(() => {
    const pane = new Pane({ title: 'CONTROLS' })

    // clear color
    pane
      .addBinding({ clear_color: SIGNALS.clear_color.value }, 'clear_color', { label: 'clear color' })
      .on('change', e => SIGNALS.clear_color.value = e.value)

    pane.addBlade({ view: 'separator' })

    // progress indicator
    const progress_binding = pane
      .addBlade({
        view: 'slider',
        label: 'progress',
        min: 0,
        max: 1,
        value: SIGNALS.progress.value,

        format: n => n === 0 ? 0
          : n === 1 ? 1
            : n.toFixed(3)
      })
      .on('change', e => SIGNALS.progress.value = e.value)

    effect(() => progress_binding.value = SIGNALS.progress.value)

    pane.addBlade({ view: 'separator' })

    // buttons
    pane
      .addButton({ title: 'donut' })
      .on('click', () => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.DONUT))

    pane
      .addButton({ title: 'suzanne' })
      .on('click', () => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.SUZANNE))

    pane
      .addButton({ title: 'sphere' })
      .on('click', () => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.SPHERE))

    pane
      .addButton({ title: 'three.js' })
      .on('click', () => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.THREEJS))

    pane.addBlade({ view: 'separator' })

    // particle colors
    pane
      .addBinding({ color_A: SIGNALS.color_A.value }, 'color_A', { label: 'particles A' })
      .on('change', e => SIGNALS.color_A.value = e.value)

    pane
      .addBinding({ color_B: SIGNALS.color_B.value }, 'color_B', { label: 'particles B' })
      .on('change', e => SIGNALS.color_B.value = e.value)

    return () => {
      pane.dispose()
    }
  }, [onButtonClick])

  return null
}

export { BUTTONS, SIGNALS, TweakPaneControls }