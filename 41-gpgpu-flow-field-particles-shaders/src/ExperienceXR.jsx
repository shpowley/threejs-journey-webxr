import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createXRStore, IfInSessionMode, noEvents, PointerEvents, XR } from '@react-three/xr'

import { PIXEL_RATIO } from './common/params'
import { ClearColor } from './components/ClearColor'
import { DOMOverlay } from './components/DOMOverlay'
import { GPGPU } from './components/GPGPU'
import { XRCameraRestore } from './components/XRCameraRestore'
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
    <GPGPU />
  </>
}

const ExperienceXR = () => {
  return <>
    <DOMOverlay />

    <Canvas
      flat

      camera={{
        fov: 35,
        near: 0.1,
        far: 100,
        position: [5.4, 4, 13.2]
        // position: [4.5, 4, 11] // original
      }}

      gl={{
        pixelRatio: PIXEL_RATIO,
        antialias: true
      }}

      events={noEvents}
    >
      <XR store={xr_store}>
        <PointerEvents />
        <ClearColor />
        <XRCameraRestore />

        {/* THE 'ORIGINAL' NON-XR SCENE */}
        <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
          <ContentNormal />
        </IfInSessionMode>
      </XR>
    </Canvas>
  </>
}

export { ExperienceXR }
