import { Center, OrbitControls, shaderMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Handle, HandleTarget } from '@react-three/handle'
import { createXRStore, IfInSessionMode, useXRControllerLocomotion, XR, XROrigin } from '@react-three/xr'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { XRCameraRestore } from '../src/components/XRCameraRestore'
import { isAppleMobile, isMobile } from './common/utils'
import { DOMOverlay } from './components/DOMOverlay'
import { FirstFrame } from './components/FirstFrame'

import portalFragmentShader from './shaders/portal/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'

const DEVICE = {
  IS_MOBILE: isMobile(),
  IS_APPLE_MOBILE: isAppleMobile()
}

const DEFAULTS = {
  VR: {
    SCALE: 0.6,
    POSITION: [0, 0, 1.8],
  },

  AR: {
    SCALE: 0.15,

    POSITION: DEVICE.IS_APPLE_MOBILE ?
      [0, 1.4, -0.5] :

      DEVICE.IS_MOBILE ?
        [0, 0.9, -0.55] :
        [0, 0.8, -0.7]
  },

  HANDLE_OFFSET_Y: 0.0055
}

/** COMMENTS RE: POINTER
 * `cursorModel: false` ..hides glowing pointer for both hands and controller
 * - somewhat subjective, but the pointers are visually "off" in many handle-grabbing ops. especially noticeable with ray-grabbing.
 * - just set true or remove those lines in the future to test if positioning is fixed
 */
const xr_store = createXRStore({
  offerSession: false,
  frameBufferScaling: 1.5, // higher visual quality on vr headsets. impacts performance.
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

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#ffffff'),
    uColorEnd: new THREE.Color('#000000')
  },
  portalVertexShader,
  portalFragmentShader
)

extend({ PortalMaterial })

const Portal = ({ fireflies_scale = 1, ar_mode = false }) => {
  const { nodes } = useGLTF('./model/portal.glb')

  const bakedTexture = useTexture('./model/baked.jpg')
  bakedTexture.flipY = false

  const portalMaterial = useRef()

  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta
  })

  return <>
    <mesh geometry={nodes.baked.geometry}>
      <meshBasicMaterial map={bakedTexture} />
    </mesh>

    <mesh geometry={nodes.poleLightA.geometry} position={nodes.poleLightA.position}>
      <meshBasicMaterial color="#ffffe5" />
    </mesh>

    <mesh geometry={nodes.poleLightB.geometry} position={nodes.poleLightB.position}>
      <meshBasicMaterial color="#ffffe5" />
    </mesh>

    <mesh geometry={nodes.portalLight.geometry} position={nodes.portalLight.position} rotation={nodes.portalLight.rotation}>
      <portalMaterial ref={portalMaterial} />
    </mesh>

    <Sparkles
      size={6 * fireflies_scale}
      scale={ar_mode ? [3, 1, 3] : [4, 2, 4]}
      position-y={ar_mode ? 1.5 : 1}
      speed={ar_mode ? 0.05 : 0.2}
      count={40}
    />
  </>
}

const ContentVR = () => {
  const refs = {
    origin: useRef()
  }

  // controller locomotion around the scene
  // https://pmndrs.github.io/xr/docs/getting-started/all-hooks#usexrcontrollerlocomotion
  useXRControllerLocomotion(
    refs.origin,
    { speed: 0.8 },
    { degrees: 45 }
  )

  return <>
    <XROrigin
      ref={refs.origin}
      scale={DEFAULTS.VR.SCALE}
      position={DEFAULTS.VR.POSITION}
    />

    <Portal fireflies_scale={1 / DEFAULTS.VR.SCALE} />
  </>
}

const ContentAR = () => {
  const refs = {
    portal: useRef(),
    handle: useRef()
  }

  useEffect(() => {
    if (refs.handle.current) {
      // initial placement of the "handle"
      refs.handle.current.position.fromArray(DEFAULTS.AR.POSITION)
    }
  }, [])

  /** REACT-THREE/HANDLES
   * https://pmndrs.github.io/xr/docs/handles/introduction
   * - grab, move, rotate, scale objects in XR
   *
   *
   * BUG "@react-three/handle": 6.6.8
   *   - in this demo, the <Handle> is just a simple <boxGeometry> mesh with:
   *     MOVE and ROTATION (Y-AXIS) only
   *     HMD HEADSET + HAND-GRAB OPS
   *
   *   - note that HAND-RAY OPS seem ok
   *   - <Handle> apply function is NOT related to this bug (commenting this out, but is present on just the <boxGeometry> handle)
   *
   *   OBSERVATION 1
   *     - when grabbing the <Handle> with hands + moving/rotating, it's "touchy" and imprecise
   *     - overall <Handle> movement becomes exaggerated based on
   *       1) distance traveled
   *       2) specific hand rotations while moving (difficult to explain. ex. hand "twist" really distort handle translation)
   *
   *   OBSERVATION 2
   *     - modifying <Handle> for ONLY MOVEMENT or ONLY ROTATION - when individually tested these ops are VERY PRECISE
   */
  return <>
    {
      !DEVICE.IS_MOBILE &&
      <FirstFrame
        onFirstFrame={camera => refs.handle?.current.position.setY(camera.position.y - 0.4)}
      />
    }

    <HandleTarget ref={refs.handle}>
      <group
        ref={refs.portal}
        scale={DEFAULTS.AR.SCALE}
        position-y={DEFAULTS.HANDLE_OFFSET_Y}
      >
        <Portal
          fireflies_scale={DEFAULTS.AR.SCALE}
          ar_mode
        />
      </group>

      <Handle
        targetRef={'from-context'}
        scale={false}
        translate={true}
        rotate={'y'}
        multitouch={true}
      >
        <mesh>
          <boxGeometry args={[0.6, 0.01, 0.6]} />
          <meshBasicMaterial color={0xfcba03} />
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
      fov: 45,
      near: 0.1,
      far: 50,
      position: [1, 2, 6]
    }}
  >
    <color args={['#030202']} attach="background" />

    <XR store={xr_store}>
      <XRCameraRestore />

      {/* THE 'ORIGINAL' NON-XR SCENE */}
      <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
        <OrbitControls makeDefault />

        <Center>
          <Portal />
        </Center>
      </IfInSessionMode>

      {/* IMMERSIVE VR - ROOM SCALE */}
      <IfInSessionMode allow={'immersive-vr'}>
        <ContentVR />
      </IfInSessionMode>

      {/* MIXED REALITY - TOY SCALE */}
      <IfInSessionMode allow={'immersive-ar'}>
        <ContentAR />
      </IfInSessionMode >
    </XR>
  </Canvas>
</>

export { ExperienceXR }