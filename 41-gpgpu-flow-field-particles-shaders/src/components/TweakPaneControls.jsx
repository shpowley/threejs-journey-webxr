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

    // clear color
    pane
      .addBinding({ clear_color: SIGNALS.clear_color.value }, 'clear_color', { label: 'clear color' })
      .on('change', e => SIGNALS.clear_color.value = e.value)

    pane.addBlade({ view: 'separator' })

    // particle size
    pane
      .addBlade({
        view: 'slider',
        label: 'particle size',
        min: 0,
        max: 1,
        value: SIGNALS.particle_size.value,
        format: n => n.toFixed(3)
      })
      .on('change', e => SIGNALS.particle_size.value = e.value)

    // flow field influence
    pane
      .addBlade({
        view: 'slider',
        label: 'flow field influence',
        min: 0,
        max: 1,
        value: SIGNALS.field_influence.value,
        format: n => n.toFixed(2)
      })
      .on('change', e => SIGNALS.field_influence.value = e.value)

    // flow field strength
    pane
      .addBlade({
        view: 'slider',
        label: 'flow field strength',
        min: 0,
        max: 10,
        value: SIGNALS.field_strength.value,
        format: n => n.toFixed(2)
      })
      .on('change', e => SIGNALS.field_strength.value = e.value)

    // flow field frequency
    pane
      .addBlade({
        view: 'slider',
        label: 'flow field frequency',
        min: 0,
        max: 1,
        value: SIGNALS.field_frequency.value,
        format: n => n.toFixed(3)
      })
      .on('change', e => SIGNALS.field_frequency.value = e.value)

    pane.addBlade({ view: 'separator' })

    // debug mesh
    pane
      .addBinding({ debug_mesh: SIGNALS.debug_mesh.value }, 'debug_mesh', { label: 'debug mesh' })
      .on('change', e => SIGNALS.debug_mesh.value = e.value)

    return () => {
      pane.dispose()
    }
  }, [onButtonClick])

  return null
}

export { TweakPaneControls }