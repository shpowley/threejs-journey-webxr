import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Handle, HandleTarget } from '@react-three/handle'
import { createXRStore, IfInSessionMode, noEvents, PointerEvents, XR, XROrigin } from '@react-three/xr'
import { useEffect, useRef } from 'react'

import { PIXEL_RATIO } from './common/params'
import { DEVICE } from './common/utils'
import { ClearColor } from './components/ClearColor'
import { DOMOverlay } from './components/DOMOverlay'
import { ParticlesMorph } from './components/ParticlesMorph'
import { TweakPaneControls } from './components/TweakPaneControls'
import { XRCameraRestore } from './components/XRCameraRestore'
import { XROverlayHMD, XROverlayMobile } from './components/XROverlay'

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

const ContentNormal = () => {
  const refs = {
    particles: useRef()
  }

  return <>
    <TweakPaneControls onButtonClick={e => refs.particles?.current.particleMorph(e)} />
    <OrbitControls />
    <ParticlesMorph ref={refs.particles} />
  </>
}

const ContentHMD = () => {
  const DEFAULTS = {
    SCALE: 0.12,
    POSITION: [0, -1.5, 1.3]
  }

  const refs = {
    particles: useRef(),
    overlay: useRef()
  }

  useEffect(() => {
    // initial placement of handle targets
    refs.overlay?.current.position.set(0, -0.5, 0.45)
  }, [])

  return <>
    <XROrigin position={DEFAULTS.POSITION} />

    <HandleTarget ref={refs.overlay}>
      <group>
        <XROverlayHMD onButtonClick={e => refs.particles?.current.particleMorph(e)} />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh position={[0, 0.08, -0.006]}>
            <planeGeometry args={[0.33, 0.115]} />
            <meshBasicMaterial
              color={0x000088}
              transparent={true}
              opacity={0.4}
              depthTest={false}
            />
          </mesh>
        </Handle>
      </group>
    </HandleTarget>

    <HandleTarget>
      <group scale={DEFAULTS.SCALE}>
        <ParticlesMorph
          ref={refs.particles}
          scale={DEFAULTS.SCALE}
        />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh>
            <icosahedronGeometry args={[3, 0]} />
            <meshBasicMaterial
              transparent={true}
              opacity={0}
            />
          </mesh>
        </Handle>
      </group>
    </HandleTarget>
  </>
}

const ContentMobile = () => {
  const DEFAULTS = {
    SCALE: 0.12,
    PARTICLE_SCALE: DEVICE.isAppleMobile() ? 0.04 : 0.09,
    POSITION: [0, -1.4, 1.5]
  }

  const refs = {
    particles: useRef(),
    overlay: useRef()
  }

  return <>
    <XROrigin position={DEFAULTS.POSITION} />

    <XROverlayMobile onButtonClick={e => refs.particles?.current.particleMorph(e)} />

    <HandleTarget>
      <group scale={DEFAULTS.SCALE}>
        <ParticlesMorph
          ref={refs.particles}
          scale={DEFAULTS.PARTICLE_SCALE}
        />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh>
            <boxGeometry args={[10, 5, 10]} />
            <meshBasicMaterial
              transparent={true}
              opacity={0}
            />
          </mesh>
        </Handle>
      </group>
    </HandleTarget>
  </>
}

const ExperienceXR = () => {
  return <>
    <DOMOverlay store={xr_store} />

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
      <XR store={xr_store}>
        <PointerEvents />
        <ClearColor />
        <XRCameraRestore />

        {/* THE 'ORIGINAL' NON-XR SCENE */}
        <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
          <ContentNormal />
        </IfInSessionMode>

        {/* EITHER AR OR VR */}
        <IfInSessionMode allow={['immersive-ar', 'immersive-vr']}>
          {
            DEVICE.isMobile() ?
              <ContentMobile /> :
              <ContentHMD />
          }
        </IfInSessionMode >
      </XR>
    </Canvas>
  </>
}

export { ExperienceXR }