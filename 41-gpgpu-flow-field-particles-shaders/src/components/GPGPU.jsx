import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { effect } from '@preact/signals-react'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

import gpgpuParticlesShader from '../shaders/gpgpu/particles.glsl'
import particlesFragmentShader from '../shaders/particles/fragment.glsl'
import particlesVertexShader from '../shaders/particles/vertex.glsl'

import { PIXEL_RATIO, SIGNALS } from '../common/params'
import { ResizeListener } from './ResizeListener'

const GPGPU = () => {
  const base_geometry = {
    instance: useRef(),
    count: useRef()
  }

  const gpgpu = {
    size: useRef(),
    computation: useRef(),
    particles_variable: useRef()
  }

  const particles = {
    geometry: useRef(new THREE.BufferGeometry()),
    material: useRef()
  }

  const refs = {
    debug_mesh: useRef(),
    debug_material: useRef()
  }

  const handlers = {
    resize: useCallback(() => particles.material.current?.uniforms.uResolution.value.set(
      window.innerWidth * PIXEL_RATIO,
      window.innerHeight * PIXEL_RATIO
    ), [])
  }

  const renderer = useThree(s => s.gl)

  const { scene } = useGLTF('./model.glb')

  useEffect(() => {
    if (scene && !base_geometry.instance.current) {

      // -- BASE GEOMETRY --
      base_geometry.instance.current = scene.children[0].geometry
      base_geometry.count.current = base_geometry.instance.current.attributes.position.count


      // -- GPU COMPUTE --

      // setup
      gpgpu.size.current = Math.ceil(Math.sqrt(base_geometry.count.current))
      gpgpu.computation.current = new GPUComputationRenderer(gpgpu.size.current, gpgpu.size.current, renderer)

      // base particles
      const base_particles_texture = gpgpu.computation.current.createTexture()

      for (let i = 0; i < base_geometry.count.current; i++) {
        const
          i3 = i * 3,
          i4 = i * 4

        // position based on geometry
        base_particles_texture.image.data[i4 + 0] = base_geometry.instance.current.attributes.position.array[i3 + 0]
        base_particles_texture.image.data[i4 + 1] = base_geometry.instance.current.attributes.position.array[i3 + 1]
        base_particles_texture.image.data[i4 + 2] = base_geometry.instance.current.attributes.position.array[i3 + 2]
        base_particles_texture.image.data[i4 + 3] = Math.random() // particles random life/death state
      }

      // particles variable
      gpgpu.particles_variable.current = gpgpu.computation.current.addVariable('uParticles', gpgpuParticlesShader, base_particles_texture)
      gpgpu.computation.current.setVariableDependencies(gpgpu.particles_variable.current, [gpgpu.particles_variable.current])

      // uniforms
      gpgpu.particles_variable.current.material.uniforms.uTime = new THREE.Uniform(0)
      gpgpu.particles_variable.current.material.uniforms.uDeltaTime = new THREE.Uniform(0)
      gpgpu.particles_variable.current.material.uniforms.uBase = new THREE.Uniform(base_particles_texture)
      gpgpu.particles_variable.current.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(SIGNALS.field_influence.value)
      gpgpu.particles_variable.current.material.uniforms.uFlowFieldStrength = new THREE.Uniform(SIGNALS.field_strength.value)
      gpgpu.particles_variable.current.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(SIGNALS.field_frequency.value)

      // init
      gpgpu.computation.current.init()


      // -- PARTICLES --

      // geometry
      const
        particles_uv_array = new Float32Array(base_geometry.count.current * 2),
        sizes_array = new Float32Array(base_geometry.count.current)

      for (let y = 0; y < gpgpu.size.current; y++) {
        for (let x = 0; x < gpgpu.size.current; x++) {
          const
            i = (y * gpgpu.size.current + x),
            i2 = i * 2

          // uv
          const
            uv_x = (x + 0.5) / gpgpu.size.current,
            uv_y = (y + 0.5) / gpgpu.size.current

          particles_uv_array[i2 + 0] = uv_x
          particles_uv_array[i2 + 1] = uv_y

          // size
          sizes_array[i] = Math.random()
        }
      }

      particles.geometry.current.setDrawRange(0, base_geometry.count.current)
      particles.geometry.current.setAttribute('aParticlesUv', new THREE.BufferAttribute(particles_uv_array, 2))
      particles.geometry.current.setAttribute('aColor', base_geometry.instance.current.attributes.color)
      particles.geometry.current.setAttribute('aSize', new THREE.BufferAttribute(sizes_array, 1))


      // -- DEBUG MESH --
      refs.debug_material.current.map = gpgpu.computation.current?.getCurrentRenderTarget(gpgpu.particles_variable.current).texture
    }
  }, [scene])

  useEffect(() => {
    const effectDebug = effect(() => {
      refs.debug_mesh.current.visible = SIGNALS.debug_mesh.value
    })

    const effectField = effect(() => {
      particles.material.current.uniforms.uSize.value = SIGNALS.particle_size.value
      gpgpu.particles_variable.current.material.uniforms.uFlowFieldInfluence.value = SIGNALS.field_influence.value
      gpgpu.particles_variable.current.material.uniforms.uFlowFieldStrength.value = SIGNALS.field_strength.value
      gpgpu.particles_variable.current.material.uniforms.uFlowFieldFrequency.value = SIGNALS.field_frequency.value
    })

    return () => {
      effectDebug()
      effectField()
    }
  }, [])

  useFrame((state, delta) => {
    // gpgpu update
    gpgpu.particles_variable.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
    gpgpu.particles_variable.current.material.uniforms.uDeltaTime.value = delta
    gpgpu.computation.current.compute()
    particles.material.current.uniforms.uParticlesTexture.value = gpgpu.computation.current.getCurrentRenderTarget(gpgpu.particles_variable.current).texture
  })

  return <>
    <ResizeListener onResize={handlers.resize} />

    <points>
      <bufferGeometry ref={particles.geometry} />
      <shaderMaterial
        ref={particles.material}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}

        uniforms={{
          uSize: new THREE.Uniform(SIGNALS.particle_size.value),
          uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth * PIXEL_RATIO, window.innerHeight * PIXEL_RATIO)),
          uParticlesTexture: new THREE.Uniform()
        }}
      />
    </points>

    {/* debug mesh */}
    <mesh
      ref={refs.debug_mesh}
      position-x={5}
      visible={SIGNALS.debug_mesh.value}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial ref={refs.debug_material} />
    </mesh>
  </>
}

export { GPGPU }