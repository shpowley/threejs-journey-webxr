import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'

import { SIGNALS } from '../common/params'

import atmosphereFragmentShader from '../shaders/atmosphere/fragment.glsl'
import atmosphereVertexShader from '../shaders/atmosphere/vertex.glsl'
import earthFragmentShader from '../shaders/earth/fragment.glsl'
import earthVertexShader from '../shaders/earth/vertex.glsl'

const earthGeometry = new THREE.SphereGeometry(2, 64, 64)

const Earth = () => {
  const refs = {
    earth: useRef(),
    earth_material: useRef(),
    atmosphere_material: useRef(),
    sun: useRef()
  }

  const sun = {
    spherical: useRef(new THREE.Spherical(1, SIGNALS.sun_angle.phi.value, SIGNALS.sun_angle.theta.value)),
    direction: useRef(new THREE.Vector3())
  }

  const handlers = {
    updateSun: useCallback(() => {
      sun.direction.current.setFromSpherical(sun.spherical.current)

      refs.sun.current.position
        .copy(sun.direction.current)
        .multiplyScalar(5)

      refs.earth_material.current.uniforms.uSunDirection.value.copy(sun.direction.current)
      refs.atmosphere_material.current.uniforms.uSunDirection.value.copy(sun.direction.current)
    }, [])
  }

  const textures = useTexture({
    day: './earth/day.webp',
    night: './earth/night.webp',
    specular: './earth/specularClouds.webp'
  })

  useEffect(() => {
    textures.day.colorSpace = THREE.SRGBColorSpace
    textures.night.colorSpace = THREE.SRGBColorSpace
    textures.day.anisotropy = 8
    textures.night.anisotropy = 8
    textures.specular.anisotropy = 8
  }, [textures])

  useEffect(() => {
    handlers.updateSun()
  }, [])

  useFrame((state, delta) => {
    if (refs.earth.current)
      refs.earth.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return <>
    {/* earth */}
    <mesh
      ref={refs.earth}
      geometry={earthGeometry}
    >
      <shaderMaterial
        ref={refs.earth_material}
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}

        uniforms={{
          uDayTexture: new THREE.Uniform(textures.day),
          uNightTexture: new THREE.Uniform(textures.night),
          uSpecularCloudsTexture: new THREE.Uniform(textures.specular),
          uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
          uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(SIGNALS.atmosphere_color.day.value)),
          uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(SIGNALS.atmosphere_color.night.value))
        }}
      />
    </mesh>

    {/* atmosphere */}
    <mesh
      geometry={earthGeometry}
      scale={1.04}
    >
      <shaderMaterial
        ref={refs.atmosphere_material}
        side={THREE.BackSide}
        transparent={true}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}

        uniforms={{
          uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
          uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(SIGNALS.atmosphere_color.day.value)),
          uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(SIGNALS.atmosphere_color.night.value))
        }}
      />
    </mesh>

    {/* sun */}
    <mesh ref={refs.sun}>
      <icosahedronGeometry args={[0.1, 2]} />
      <meshBasicMaterial />
    </mesh>
  </>
}

export { Earth }