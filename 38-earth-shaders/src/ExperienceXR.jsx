import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Handle, HandleTarget } from '@react-three/handle'
import { createXRStore, IfInSessionMode, noEvents, PointerEvents, XR, XROrigin } from '@react-three/xr'

import { PIXEL_RATIO } from './common/params'
import { DEVICE } from './common/utils'
import { DOMOverlay } from './components/DOMOverlay'
import { Earth } from './components/Earth'
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

    <OrbitControls
      autoRotate={true}
      autoRotateSpeed={0.2}
    />

    <Earth />
  </>
}

const ContentHMD = () => {
  const DEFAULTS = {
    SCALE: 0.25,
    POSITION: [0, -1.5, 1.3]
  }

  return <>
    <XROrigin position={DEFAULTS.POSITION} />

    <HandleTarget>
      <group scale={DEFAULTS.SCALE}>
        <Earth sun_visible={false} />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh>
            <icosahedronGeometry args={[2, 1]} />
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
    SCALE: 0.25,
    POSITION: [0, -1.4, 1.5]
  }

  return <>
    <XROrigin position={DEFAULTS.POSITION} />
    <XROverlay />

    <HandleTarget>
      <group scale={DEFAULTS.SCALE}>
        <Earth sun_visible={false} />

        <Handle
          targetRef='from-context'
          scale={false}
          translate={true}
          rotate='y'
        >
          <mesh>
            <icosahedronGeometry args={[2, 1]} />
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
      linear

      camera={{
        fov: 25,
        near: 0.1,
        far: 100,
        position: [12, 5, DEVICE.isMobile() ? 20 : 4],
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