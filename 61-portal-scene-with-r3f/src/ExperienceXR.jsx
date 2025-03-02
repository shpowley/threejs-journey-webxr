import { Center, OrbitControls, shaderMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Handle, HandleTarget } from '@react-three/handle'
import { createXRStore, IfInSessionMode, useXRControllerLocomotion, XR, XROrigin } from '@react-three/xr'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { XRCameraRestore } from '../src/components/XRCameraRestore'
import { isMobile } from './common/Utils.js'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'

const DEFAULTS = {
    VR: {
        SCALE: 0.6,
        POSITION: [0, 0, 1.8],
    },

    AR: {
        SCALE: 0.15,
        POSITION: [0, 0.8, -0.7]
    },

    HANDLE_OFFSET_Y: 0.0055
}

const xr_store = createXRStore({
    frameBufferScaling: 1.5, // higher visual quality on vr headsets. impacts performance.
    foveation: 1,

    hand: {
        model: {
            // special technique allows hands to be rendered over 3d content
            colorWrite: false,
            renderOrder: -1
        }
    },

    controller: {
        model: {
            colorWrite: false,
            renderOrder: -1
        }
    },
})

const is_mobile_device = isMobile()

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
            // initial placement of the boxGeometry handle
            refs.handle.current.position.fromArray([
                DEFAULTS.AR.POSITION[0],
                DEFAULTS.AR.POSITION[1] - DEFAULTS.HANDLE_OFFSET_Y,
                DEFAULTS.AR.POSITION[2]
            ])
        }
    }, [])

    // grabbing and placement
    // https://pmndrs.github.io/xr/docs/handles/introduction
    return <>
        <group
            ref={refs.portal}
            scale={DEFAULTS.AR.SCALE}
            position={DEFAULTS.AR.POSITION}
        >
            <Portal
                fireflies_scale={DEFAULTS.AR.SCALE}
                ar_mode
            />
        </group>

        <HandleTarget ref={refs.handle}>
            <Handle
                targetRef={'from-context'}
                scale={false}
                translate={true}
                rotate={'y'}
                multitouch={true}

                // move/rotate boxGeometry "handle" and copy to the portal scene
                apply={(state, target) => {
                    target.position.copy(state.current.position)
                    refs.portal.current.position.copy(target.position)
                    refs.portal.current.position.y += DEFAULTS.HANDLE_OFFSET_Y // maintain scene's vertical offset

                    refs.portal.current.rotation.y = target.rotation.y = state.current.rotation.y
                }}
            >
                <mesh>
                    <boxGeometry args={[0.6, 0.01, 0.6]} />
                    <meshBasicMaterial color={0xfcba03} />
                </mesh>
            </Handle>
        </HandleTarget>
    </>
}

const Experience = () => <>
    {/* the 'original' non-xr scene */}
    <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
        <OrbitControls makeDefault />

        <Center>
            <Portal />
        </Center>
    </IfInSessionMode>

    {/* immersive vr - room scale */}
    <IfInSessionMode allow={'immersive-vr'}>
        <ContentVR />
    </IfInSessionMode>

    {/* mixed reality - toy scale */}
    <IfInSessionMode allow={'immersive-ar'}>
        <ContentAR />
    </IfInSessionMode >
</>

const ExperienceXR = () => {
    return <>
        <div id='title'>
            <a href='https://threejs-journey.com/'>three.js journey</a><br />
            Portal Scene with R3F
        </div>

        {/* VR mode buttons */}
        <div id='div_buttons'>
            {
                // disable vr mode on mobile (mobile vr is deprecated more or less, e.g. google cardboard)
                !is_mobile_device && navigator?.xr?.isSessionSupported('immersive-vr') &&
                <button onClick={() => xr_store.enterVR()}>VR</button>
            }

            {
                navigator?.xr?.isSessionSupported('immersive-ar') &&
                <button onClick={() => xr_store.enterAR()}>AR</button>
            }
        </div>

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
                <Experience />
            </XR>
        </Canvas>
    </>
}

export { ExperienceXR }