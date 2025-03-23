import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createXRStore, IfInSessionMode, noEvents, PointerEvents, XR } from '@react-three/xr'

import { PIXEL_RATIO } from './common/params'
import { Earth } from './components/Earth'
import { DOMOverlay } from './components/DOMOverlay'
import { TweakPaneControls } from './components/TweakPaneControls'

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
    <TweakPaneControls />
    <OrbitControls />
    <Earth />
  </>
}

const ExperienceXR = () => {
  return <>
    <DOMOverlay store={xr_store} />

    <Canvas
      linear

      camera={{
        fov: 25,
        near: 0.1,
        far: 100,
        position: [12, 5, 4],
      }}

      gl={{
        pixelRatio: PIXEL_RATIO,
        antialias: true
      }}

      events={noEvents}
    >
      <color args={['#000011']} attach="background" />

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