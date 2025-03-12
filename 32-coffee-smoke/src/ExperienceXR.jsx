import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createXRStore, IfInSessionMode, XR } from '@react-three/xr'
import { useRef } from 'react'

import { CoffeeSmoke } from './components/CoffeeSmoke'
import { DOMOverlay } from './components/DOMOverlay'
import { FirstFrame } from './components/FirstFrame'
import { XRCameraRestore } from './components/XRCameraRestore'

const xr_store = createXRStore({
  offerSession: false,
  frameBufferScaling: 2.0,
  foveation: 1,

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

// ADJUST SCENE FOR OPTIMAL HEADSET HEIGHT ON FIRST FRAME (HACK)
function adjustScenePosition(camera, ref_scene, height_offset = 0) {
  if (ref_scene.current) {
    ref_scene.current.position.setY(camera.position.y + height_offset)
  }
}

const ContentVR = () => {
  const refs = {
    coffee_scene: useRef(),
  }

  return <>
    <FirstFrame onFirstFrame={camera => adjustScenePosition(camera, refs.coffee_scene, -0.2)} />

    <group
      ref={refs.coffee_scene}
      scale={0.05}
      position={[0, 0.85, -0.65]} // SEATED POSITION (HMD)
      rotation={[0, -Math.PI * 0.05, 0]}
    >
      <CoffeeSmoke />
    </group>
  </>
}

const ContentAR = () => {
  const refs = {
    coffee_scene: useRef(),
  }

  return <>
    <FirstFrame onFirstFrame={camera => adjustScenePosition(camera, refs.coffee_scene, -0.3)} />

    <group
      ref={refs.coffee_scene}
      scale={0.05}
      position={[0, 0.85, -0.6]} // // SEATED POSITION (HMD)
    >
      <CoffeeSmoke />
    </group>
  </>
}

const ExperienceXR = () => <>
  <DOMOverlay xr_store={xr_store} />

  <Canvas
    flat

    camera={{
      fov: 25,
      near: 0.1,
      far: 100,
      position: [8.5, 8, 11.5]
    }}
  >
    <color args={[0x0]} attach={'background'} />

    <XR store={xr_store}>
      <XRCameraRestore />

      {/* THE 'ORIGINAL' NON-XR SCENE */}
      <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
        <OrbitControls
          target={[0, 0.9, 0]}
          autoRotate={true}
          autoRotateSpeed={0.2}
        />

        <CoffeeSmoke />
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

export { ExperienceXR }