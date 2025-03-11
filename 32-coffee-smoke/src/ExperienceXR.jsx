import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import coffeeSmokeFragmentShader from './shaders/coffeeSmoke/fragment.glsl'
import coffeeSmokeVertexShader from './shaders/coffeeSmoke/vertex.glsl'

const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64)
smokeGeometry.translate(0, 0.5, 0)
smokeGeometry.scale(1.5, 6, 1.5)

const Experience = () => {
  const coffeeSmokeMaterial = useRef()

  const { nodes } = useGLTF('./bakedModel.glb')

  const perlinTexture = useTexture('./perlin.png')
  perlinTexture.wrapS = THREE.RepeatWrapping
  perlinTexture.wrapT = THREE.RepeatWrapping

  useFrame((state, delta) => {
    coffeeSmokeMaterial.current.uniforms.uTime.value += delta;
  })

  return <>
    <OrbitControls target={[0, 0.9, 0]} />

    <mesh
      geometry={nodes.baked.geometry}
      material={nodes.baked.material}
    />

    <mesh geometry={smokeGeometry}>
      <shaderMaterial
        ref={coffeeSmokeMaterial}
        vertexShader={coffeeSmokeVertexShader}
        fragmentShader={coffeeSmokeFragmentShader}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}

        uniforms={{
          uTime: { value: 0 },
          uPerlinTexture: new THREE.Uniform(perlinTexture),
        }}
      />
    </mesh>
  </>
}

const ExperienceXR = () => {
  return <Canvas
    flat

    camera={{
      fov: 25,
      near: 0.1,
      far: 100,
      position: [8.5, 8, 11.5]
    }}
  >
    <color
      args={[0x0]}
      attach={'background'}
    />

    <Experience />
  </Canvas>
}

export { ExperienceXR }