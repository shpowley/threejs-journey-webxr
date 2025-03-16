import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createXRStore, IfInSessionMode, XR } from '@react-three/xr'
import { useRef } from 'react'

import { PIXEL_RATIO } from './common/params'
import { isMobile } from './common/utils'
import { ClearColor } from './components/ClearColor'
import { DOMOverlay } from './components/DOMOverlay'
import { ParticlesMorph } from './components/ParticlesMorph'
import { TweakPaneControls } from './components/TweakPaneControls'
import { XRCameraRestore } from './components/XRCameraRestore'

const xr_store = createXRStore({
  offerSession: false,
  frameBufferScaling: 1.5,
  foveation: 0, // large rectangulr artifacts noticeable in "bright glow" immersive-vr @ foveation = 1

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

const ContentAR = () => {
  return <ParticlesMorph />
}

const ContentVR = () => {
  return <ParticlesMorph />
}

const ExperienceXR = () => {
  const refs = {
    particles: useRef()
  }

  return <>
    <DOMOverlay store={xr_store} />

    <Canvas
      flat

      camera={{
        fov: 35,
        near: 0.1,
        far: 100,
        position: [0, 0, isMobile() ? 42 : 16]
      }}

      gl={{
        pixelRatio: PIXEL_RATIO,
        antialias: true
      }}
    >
      <XR store={xr_store}>
        <ClearColor />
        <XRCameraRestore />

        {/* THE 'ORIGINAL' NON-XR SCENE */}
        <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
          {/*
            1 - MOVE TO ContentNormal
            2 - RESIZE & POSITION AR/VR
            3 - UIKIT FULLSCREEN MORPH BUTTONS
            3 - HANDLES (TRIGGER = ROTATE, GRAB = MOVE ..?)
            */}
          <TweakPaneControls onButtonClick={e => refs.particles?.current.particleMorph(e)} />
          <OrbitControls />
          <ParticlesMorph ref={refs.particles} />
        </IfInSessionMode>

        {/* IMMERSIVE VR */}
        <IfInSessionMode allow={'immersive-vr'}>
          <ContentVR />
        </IfInSessionMode>

        {/* MIXED REALITY */}
        <IfInSessionMode allow={'immersive-ar'}>
          <ContentAR />
        </IfInSessionMode >
      </XR>
    </Canvas>
  </>
}

export { ExperienceXR }