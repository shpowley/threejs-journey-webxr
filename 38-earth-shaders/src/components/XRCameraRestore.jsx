import { useThree } from '@react-three/fiber'
import { useXRSessionVisibilityState } from '@react-three/xr'
import { useEffect, useState } from 'react'

// custom component
// restores camera when switching from XR to non-XR modes
const XRCameraRestore = () => {
  const [camera_restore, setCameraRestore] = useState()
  const camera = useThree(s => s.camera)
  const xr_visibility = useXRSessionVisibilityState()

  if (!xr_visibility && camera_restore) {
    camera.copy(camera_restore)
  }

  useEffect(() => {
    setCameraRestore(camera.clone())
  }, [])

  return null
}

export { XRCameraRestore }