import anime from 'animejs'
import { useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

import { PIXEL_RATIO, SIGNALS } from '../common/params'
import { ResizeListener } from './ResizeListener'
import { BUTTONS } from './TweakPaneControls'

import particlesFragmentShader from '../shaders/particles/fragment.glsl'
import particlesVertexShader from '../shaders/particles/vertex.glsl'

const ParticlesMorph = ({ ref }) => {
  const refs = {
    animation_morph: useRef(),
    material_morph: useRef(),
    particles_geometry: useRef()
  }

  const handlers = {
    resize: useCallback(() => {
      console.log('TODO - RESIZE')
    }, []),

    particleMorph: useCallback(e => {
      switch (e) {
        case BUTTONS.DONUT:
          console.log('DONUT MORPH')
          break

        case BUTTONS.SUZANNE:
          console.log('SUZANNE MORPH')
          break

        case BUTTONS.SPHERE:
          console.log('SPHERE MORPH')
          break

        case BUTTONS.THREEJS:
          console.log('THREE.JS MORPH')
      }

      SIGNALS.progress.value = 0

      refs.animation_morph = anime({
        targets: SIGNALS.progress,
        value: 1,
        duration: 3000,
        easing: 'linear'
      })
    }, [])
  }

  useImperativeHandle(ref, () => {
    return {
      particleMorph: handlers.particleMorph
    }
  }, [])

  // const gl = useThree(s => s.gl)
  // console.log('PIXEL RATIO', gl.pixelRatio)
  // return null

  useEffect(() => {

  }, [])

  return <>
    <ResizeListener onResize={handlers.resize} />

    <points frustumCulled={false}>
      <bufferGeometry ref={refs.particles_geometry} />
      <shaderMaterial
        ref={refs.material_morph}
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