import { effect } from '@preact/signals-react'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useRef } from 'react'

import { PIXEL_RATIO, SIGNALS } from './common/params'
import { ParticlesMorph } from './components/ParticlesMorph'
import { TweakPaneControls } from './components/TweakPaneControls'

const ClearColor = () => {
  const gl = useThree(s => s.gl)
  gl.setClearColor(SIGNALS.clear_color.value, 1)

  effect(() => gl.setClearColor(SIGNALS.clear_color.value, 1))

  return null
}

const ExperienceXR = () => {
  const refs = {
    particles: useRef()
  }

  return <>
    <Canvas
      flat

      camera={{
        fov: 35,
        near: 0.1,
        far: 100,
        position: [0, 0, 16]
      }}

      gl={{ pixelRatio: PIXEL_RATIO }}
    >
      {/* (TODO) TweakPaneControls IN CANVAS JSX -- FOR XR MODES SPECIFICALLY? */}
      <TweakPaneControls onButtonClick={e => refs.particles?.current.particleMorph(e)} />

      {/* (TODO) CLEAR COLOR AFFECTS XR? OR MAYBE <color attach> */}
      <ClearColor />

      <OrbitControls />

      <ParticlesMorph ref={refs.particles} />
    </Canvas>
  </>
}

export { ExperienceXR }