import { useXRStore, XRDomOverlay } from '@react-three/xr'

import './xroverlay.css'

const XROverlay = () => {
  const xr_store = useXRStore()

  return <XRDomOverlay>
    <img
      id='image_xr_close'
      src='./overlay/close_xr.svg'
      onPointerDown={() => xr_store.getState().session.end()}
    />
  </XRDomOverlay>
}

export { XROverlay }