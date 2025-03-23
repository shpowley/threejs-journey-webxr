import { effect } from '@preact/signals-react'
import { useEffect } from 'react'
import { Pane } from 'tweakpane'

import { SIGNALS } from '../common/params'

// https://tweakpane.github.io/docs/ (replacement for leva)
const TweakPaneControls = ({ onButtonClick }) => {
  useEffect(() => {
    const pane = new Pane({
      title: 'CONTROLS',
      expanded: false,
      container: document.getElementById('tweakpane_container')
    })

    // atmosphere colors
    pane
      .addBinding({ color_day: SIGNALS.atmosphere_color.day.value }, 'color_day', { label: 'atmosphere day' })
      .on('change', e => SIGNALS.color_day.value = e.value)

    pane
      .addBinding({ color_night: SIGNALS.atmosphere_color.night.value }, 'color_night', { label: 'atmosphere night' })
      .on('change', e => SIGNALS.color_night.value = e.value)

    pane.addBlade({ view: 'separator' })

    // sun angles
    const phi_angle_binding = pane
      .addBlade({
        view: 'slider',
        label: 'sun polar angle (phi)',
        min: 0,
        max: Math.PI,
        value: SIGNALS.sun_angle.phi.value,

        // format: n => n.toFixed(5)
      })
      .on('change', e => SIGNALS.sun_angle.phi.value = e.value)

    const theta_angle_binding = pane
      .addBlade({
        view: 'slider',
        label: 'sun equator angle (theta)',
        min: -Math.PI,
        max: Math.PI,
        value: SIGNALS.sun_angle.theta.value,

        // format: n => n.toFixed(5)
      })
      .on('change', e => SIGNALS.sun_angle.theta.value = e.value)

      const disposeSignal = effect(() => {
        phi_angle_binding.value = SIGNALS.sun_angle.phi.value
        theta_angle_binding.value = SIGNALS.sun_angle.theta.value
      })

    return () => {
      pane.dispose()
      disposeSignal()
    }
  }, [onButtonClick])

  return null
}

export { SIGNALS, TweakPaneControls }