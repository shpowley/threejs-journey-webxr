import { effect } from '@preact/signals-react'
import { useThree } from '@react-three/fiber'

import { SIGNALS } from '../common/params'

const ClearColor = () => {
  const gl = useThree(s => s.gl)
  gl.setClearColor(SIGNALS.clear_color.value, 1)

  effect(() => gl.setClearColor(SIGNALS.clear_color.value, 1))

  return null
}

export { ClearColor }