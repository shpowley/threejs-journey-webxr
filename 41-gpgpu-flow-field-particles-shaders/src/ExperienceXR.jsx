import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Handle, HandleTarget } from '@react-three/handle'
import { createXRStore, IfInSessionMode, noEvents, PointerEvents, XR, XROrigin } from '@react-three/xr'

import { PIXEL_RATIO } from './common/params'
import { DEVICE } from './common/utils'
import { ClearColor } from './components/ClearColor'
import { DOMOverlay } from './components/DOMOverlay'
import { GPGPU } from './components/GPGPU'
import { TweakPaneControls } from './components/TweakPaneControls'
import { XRCameraRestore } from './components/XRCameraRestore'
import { XROverlay } from './components/XROverlay'

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

const ContentHMD = () => {
  const DEFAULTS = {
    SCALE: 0.18,
    POSITION: [0.4, -1.1, 1.7],
    ROTATION: Math.PI * 0.22
  }

  return <>
    <XROrigin position={DEFAULTS.POSITION} />

    <HandleTarget>
      <group
        scale={DEFAULTS.SCALE}
        rotation-y={DEFAULTS.ROTATION}
      >
        <GPGPU particle_scale={0.25} />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh position={[1, 0.2, 1]}>
            <boxGeometry args={[4, 3, 12]} />
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
    SCALE: 0.1,
    ROTATION: -Math.PI * 0.15,

    POSITION: [
      -0.1,
      DEVICE.isAppleMobile() ? -1.4 : -1.1,
      1.4
    ],
  }

  return <>
    <XROrigin position={DEFAULTS.POSITION} />
    <XROverlay />

    <HandleTarget>
      <group
        scale={DEFAULTS.SCALE}
        rotation-y={DEFAULTS.ROTATION}
      >
        <GPGPU particle_scale={DEVICE.isAppleMobile() ? 0.04 : 0.08} />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh position={[1, 0.2, 1]}>
            <boxGeometry args={[4, 3, 12]} />
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
        position: DEVICE.isMobile() ? [8.55, 6, 20.9] : [5.4, 4, 13.2]
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

        {/* AR / VR SESSION */}
        <IfInSessionMode allow={['immersive-ar', 'immersive-vr']}>
          {
            DEVICE.isMobile() ?
              <ContentMobile /> :
              <ContentHMD />
          }
        </IfInSessionMode>
      </XR>
    </Canvas>
  </>
}

export { ExperienceXR }