import { effect } from '@preact/signals-react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Tween } from '@tweenjs/tween.js'
import { useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

import { PIXEL_RATIO, SIGNALS } from '../common/params'
import { ResizeListener } from './ResizeListener'

import particlesFragmentShader from '../shaders/particles/fragment.glsl'
import particlesVertexShader from '../shaders/particles/vertex.glsl'

const ParticlesMorph = ({ ref, scale = 1 }) => {
  const refs = {
    tween_morph: useRef(new Tween(SIGNALS.progress).to({ value: 1 }, 3000))
  }

  const particles = {
    animation: useRef(),
    geometry: useRef(),
    material: useRef(),
    positions: useRef()

    // NOTE: instead of storing active model index here,
    // using preact/signals to maintain active model when switching from non-xr to xr modes
  }

  const { scene } = useGLTF('./models.glb')

  const handlers = {
    resize: useCallback(() => particles.material.current?.uniforms.uResolution.value.set(
      window.innerWidth * PIXEL_RATIO,
      window.innerHeight * PIXEL_RATIO
    ), []),

    particleMorph: useCallback(index => {
      if (
        index === SIGNALS.index.value ||
        !refs.tween_morph.current ||
        refs.tween_morph.current.isPlaying() ||
        !particles.geometry.current ||
        !particles.positions.current
      )
        return

      refs.tween_morph.current.stop()

      // update attributes
      particles.geometry.current.attributes.position = particles.positions.current[SIGNALS.index.value]
      particles.geometry.current.attributes.aPositionTarget = particles.positions.current[index]
      particles.geometry.current.attributes.position.needsUpdate = true
      particles.geometry.current.attributes.aPositionTarget.needsUpdate = true

      // animate progress
      SIGNALS.progress.value = 0
      refs.tween_morph.current.start()

      // save index
      SIGNALS.index.value = index
    }, [])
  }

  useImperativeHandle(ref, () => ({
    particleMorph: handlers.particleMorph
  }), [])

  useEffect(() => {
    particles.positions.current = []

    const positions = scene.children.map(child => child.geometry.attributes.position)

    let max_particles = 0
    positions.forEach(position => max_particles = Math.max(position.count, max_particles))

    // positions
    positions.forEach(position => {
      const original_array = position.array
      const new_array = new Float32Array(max_particles * 3)

      for (let i = 0; i < max_particles; i++) {
        const i3 = i * 3

        if (i3 < original_array.length) {
          new_array[i3 + 0] = original_array[i3 + 0]
          new_array[i3 + 1] = original_array[i3 + 1]
          new_array[i3 + 2] = original_array[i3 + 2]
        }
        else {
          const random_index = Math.floor(position.count * Math.random()) * 3
          new_array[i3 + 0] = original_array[random_index + 0]
          new_array[i3 + 1] = original_array[random_index + 1]
          new_array[i3 + 2] = original_array[random_index + 2]
        }
      }

      particles.positions.current.push(new THREE.Float32BufferAttribute(new_array, 3))
    })

    // geometry (random particle sizes)
    const sizes_array = new Float32Array(max_particles)

    for (let i = 0; i < max_particles; i++)
      sizes_array[i] = Math.random() * scale

    SIGNALS.progress.value = 0 // reset initial progress state (for switching between non-XR => XR => non-XR)

    particles.geometry.current.setAttribute('position', particles.positions.current[SIGNALS.index.value])
    particles.geometry.current.setAttribute('aPositionTarget', particles.positions.current[3])
    particles.geometry.current.setAttribute('aSize', new THREE.BufferAttribute(sizes_array, 1))
  }, [scene, scale])

  useEffect(() => {
    const effectProgress = effect(() => {
      particles.material.current.uniforms.uProgress.value = SIGNALS.progress.value
    })

    const effectColors = effect(() => {
      particles.material.current.uniforms.uColorA.value.set(SIGNALS.color_A.value)
      particles.material.current.uniforms.uColorB.value.set(SIGNALS.color_B.value)
    })

    return () => {
      effectProgress()
      effectColors()

      refs.tween_morph?.current.stop()
    }
  }, [])

  useFrame(() => {
    refs.tween_morph?.current.update()
  })

  return <>
    <ResizeListener onResize={handlers.resize} />

    <points frustumCulled={false}>
      <bufferGeometry ref={particles.geometry} />
      <shaderMaterial
        ref={particles.material}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        blending={THREE.AdditiveBlending}
        depthWrite={false}

        uniforms={{
          uResolution: new THREE.Uniform(
            new THREE.Vector2(
              window.innerWidth * PIXEL_RATIO,
              window.innerHeight * PIXEL_RATIO
            )
          ),

          uSize: new THREE.Uniform(0.4),
          uProgress: new THREE.Uniform(0),
          uColorA: new THREE.Uniform(new THREE.Color(SIGNALS.color_A.value)),
          uColorB: new THREE.Uniform(new THREE.Color(SIGNALS.color_B.value))
        }}
      />
    </points>
  </>
}

export { ParticlesMorph }