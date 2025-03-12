import { useFrame, useThree } from '@react-three/fiber'
import { useState } from 'react'

const FirstFrameInternal = ({ onFirstFrameInternal }) => {
  let first_frame = true

  useFrame(() => {
    if (first_frame) {
      first_frame = false
      onFirstFrameInternal()
    }
  })

  return null
}

/** RE-USABLE FIRST FRAME CHECK
 *
 * - SEEMS LIKE OVERKILL, BUT AFTER FIRST FRAME + useState() RE-RENDER
 *   PREVENTS INTERNAL useFrame() FROM RUNNING
 *
 * ! COMPARED TO OTHER METHODS (TRIAL-AND-ERROR),
 *   THE CAMERA (AT THIS TIME JUNCTURE) IS A VALID XR-CAMERA-ARRAY
 */
const FirstFrame = ({ onFirstFrame }) => {
  if (typeof onFirstFrame !== 'function') return null

  const [first_frame_check, setFirstFrameCheck] = useState(true)
  const camera = useThree(s => s.camera)

  return first_frame_check &&
    <FirstFrameInternal
      onFirstFrameInternal={() => {
        onFirstFrame(camera)
        setFirstFrameCheck(false)
      }}
    />
}

export { FirstFrame }