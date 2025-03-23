import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createXRStore, IfInSessionMode, noEvents, PointerEvents, XR } from '@react-three/xr'

import { PIXEL_RATIO } from './common/params'
import { DEVICE } from './common/utils'
import { Earth } from './components/Earth'

const xr_store = createXRStore({
  offerSession: false,
  frameBufferScaling: 1.5,
  foveation: 0, // large rectangular artifacts noticeable in "bright glow" immersive-vr @ foveation = 1

  hand: {
    rayPointer: {
      cursorModel: false
    },

    grabPointer: {
      cursorModel: false
    },

    touchPointer: {
      cursorModel: false
    },

    model: {
      // technique allows hands to be rendered over 3d content
      colorWrite: false,
      renderOrder: -1
    }
  },

  controller: {
    rayPointer: {
      cursorModel: false
    },

    model: {
      colorWrite: false,
      renderOrder: -1
    }
  }
})

const ContentNormal = () => {
  return <>
    <OrbitControls />
    <Earth />
  </>
}

const ExperienceXR = () => {
  return <>
    <Canvas
      flat

      camera={{
        fov: 35,
        near: 0.1,
        far: 100,
        position: [0, 0, DEVICE.isMobile() ? 30 : 16]
      }}

      gl={{
        pixelRatio: PIXEL_RATIO,
        antialias: true
      }}

      events={noEvents}
    >
      <color args={['#030202']} attach="background" />

      <XR store={xr_store}>
        <PointerEvents />

        {/* THE 'ORIGINAL' NON-XR SCENE */}
        <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
          <ContentNormal />
        </IfInSessionMode>
      </XR>
    </Canvas>
  </>
}

export { ExperienceXR }