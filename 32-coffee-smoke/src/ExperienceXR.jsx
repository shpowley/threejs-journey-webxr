import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Handle, HandleTarget } from '@react-three/handle'
import { createXRStore, IfInSessionMode, XR } from '@react-three/xr'
import { useEffect, useRef } from 'react'

import { DEVICE } from './common/utils'
import { CoffeeSmoke } from './components/CoffeeSmoke'
import { DOMOverlay } from './components/DOMOverlay'
import { FirstFrame } from './components/FirstFrame'
import { XRCameraRestore } from './components/XRCameraRestore'
import { XROverlay } from './components/XROverlay'

const DEFAULTS = {
  VR: {
    SCALE: 0.05,
    POSITION: [0, 0.8, -0.65],
  },

  AR: {
    SCALE: 0.05,

    POSITION: DEVICE.isAppleMobile() ?
      [0, 1.4, -0.5] :

      DEVICE.isMobile() ?
        [0, 0.9, -0.55] :
        [0, 0.85, -0.7]
  },

  HANDLE_OFFSET_Y: 0.1165
}

const xr_store = createXRStore({
  offerSession: false,
  frameBufferScaling: 1.5,
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
  ref_scene?.current.position.setY(camera.position.y + height_offset)
}

const ContentVR = () => {
  const refs = {
    coffee_scene: useRef(),
    handle: useRef()
  }

  useEffect(() => {
    if (refs.handle.current) {
      refs.handle.current.position.fromArray(DEFAULTS.VR.POSITION)
      refs.handle.current.rotation.set(0, -Math.PI * 0.1, 0)
    }
  }, [])

  return <>
    <FirstFrame onFirstFrame={camera => adjustScenePosition(camera, refs.handle, -0.2)} />

    <HandleTarget ref={refs.handle}>
      <group
        ref={refs.coffee_scene}
        scale={DEFAULTS.VR.SCALE}
        position-y={DEFAULTS.HANDLE_OFFSET_Y}
      >
        <CoffeeSmoke />
      </group>

      <Handle
        targetRef={'from-context'}
        scale={false}
        translate={true}
        rotate={'y'}
        multitouch={true}
      >
        <mesh>
          <boxGeometry args={[0.499, 0.049, 0.499]} />
          <meshBasicMaterial
            color={0xffffff}
            opacity={0}
            transparent
          />
        </mesh>
      </Handle>
    </HandleTarget>
  </>
}

const ContentAR = () => {
  const refs = {
    coffee_scene: useRef(),
    handle: useRef()
  }

  useEffect(() => {
    // initial placement of the "handle"
    refs.handle?.current.position.fromArray(DEFAULTS.AR.POSITION)
  }, [])

  return <>
    {
      DEVICE.isMobile() && <XROverlay />
    }

    <HandleTarget ref={refs.handle}>
      <group
        ref={refs.coffee_scene}
        scale={DEFAULTS.AR.SCALE}
        position-y={DEFAULTS.HANDLE_OFFSET_Y}
      >
        <CoffeeSmoke />
      </group>

      <Handle
        targetRef='from-context'
        scale={false}
        translate={true}
        rotate='y'
        multitouch={true}
      >
        <mesh>
          <boxGeometry args={[0.499, 0.049, 0.499]} />
          <meshBasicMaterial
            color={0xffffff}
            opacity={0}
            transparent
          />
        </mesh>
      </Handle>
    </HandleTarget>
  </>
}

const ExperienceXR = () => <>
  <DOMOverlay store={xr_store} />

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
          autoRotateSpeed={0.1}
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