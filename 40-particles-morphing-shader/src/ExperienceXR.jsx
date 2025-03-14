import { effect } from '@preact/signals-react'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'

import { BUTTONS, SIGNALS, TweakPaneControls } from './components/TweakPaneControls'

const ClearColor = () => {
  const gl = useThree(s => s.gl)
  gl.setClearColor(SIGNALS.clear_color.value, 1)

  effect(() => gl.setClearColor(SIGNALS.clear_color.value, 1))

  return null
}

const ExperienceXR = () => {
  const handlers = {
    particleMorph: e => {
      switch (e) {
        case BUTTONS.DONUT:
          console.log('DONUT BUTTON')
          SIGNALS.progress.value = 0.5
          break

        default:
          console.log('OTHER BUTTON')
      }
    }
  }

  return <>
    <TweakPaneControls onButtonClick={handlers.particleMorph} />

    <Canvas
      flat

      camera={{
        fov: 35,
        near: 0.1,
        far: 100,
        position: [0, 0, 16]
      }}
    >
      <ClearColor />
      <OrbitControls enableDamping />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x0000a0} />
      </mesh>
    </Canvas>
  </>
}

export { ExperienceXR }