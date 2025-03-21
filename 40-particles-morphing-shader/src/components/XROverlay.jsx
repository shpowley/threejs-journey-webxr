import { Container, Root, Text } from '@react-three/uikit'
import { Button } from '@react-three/uikit-default'
import { useXRStore, XRDomOverlay } from '@react-three/xr'

import { DEVICE } from '../common/utils'
import { BUTTONS } from './TweakPaneControls'

import './xroverlay.css'

const BUTTON = {
  HEIGHT: 80,
  WIDTH: 148
}

const XRButton = ({ text, positionType = 'relative', positionBottom, backgroundColor = 0x67b0ff, onClick }) => <Button
  variant='ghost'
  positionType={positionType}
  positionBottom={positionBottom}
  backgroundColor={backgroundColor}
  hover={{ backgroundColor: 0x5ee07b }}
  height={BUTTON.HEIGHT}
  width={BUTTON.WIDTH}
  onPointerDown={onClick}
>
  <Text
    fontSize={28}
    children={text}
  />
</Button>

const Mobile = ({ onButtonClick }) => {
  const xr_store = useXRStore()

  const clickHandler = shape => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(shape)

  return <XRDomOverlay>
    <img
      id='image_xr_close'
      src='./overlay/close_xr.svg'
      onPointerDown={() => xr_store.getState().session.end()}
    />

    <div id='div_xr_buttons'>
      <button id='button_donut' onClick={() => clickHandler(BUTTONS.DONUT)}>
        <text>donut</text>
      </button>
      <button id='button_suzanne' onClick={() => clickHandler(BUTTONS.SUZANNE)}>
        <text>suzanne</text>
      </button>
      <button id='button_sphere' onClick={() => clickHandler(BUTTONS.SPHERE)}>
        <text>sphere</text>
      </button>
      <button id='button_threejs' onClick={() => clickHandler(BUTTONS.THREEJS)}>
        <text>three.js</text>
      </button>
    </div>

  </XRDomOverlay>
}

const HMD = ({ onButtonClick }) => {
  const xr_store = useXRStore()

  return <Root
    alignItems='center'
    justifyContent='center'
    transformScale={0.21}
    depthTest={false}
  >
    <Container
      positionType='absolute'
      positionBottom={200}
      alignItems='center'
      justifyContent='center'
      height={BUTTON.HEIGHT + 10}
      width={BUTTON.WIDTH * 4 * 1.2}
      gapColumn={18}
    >
      <XRButton text='donut' onClick={() => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.DONUT)} />
      <XRButton text='suzanne' onClick={() => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.SUZANNE)} />
      <XRButton text='sphere' onClick={() => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.SPHERE)} />
      <XRButton text='three.js' onClick={() => onButtonClick && typeof onButtonClick === 'function' && onButtonClick(BUTTONS.THREEJS)} />
    </Container>

    <XRButton
      text={`exit session`}
      backgroundColor={0xb5723c}
      positionType='absolute'
      positionBottom={80}
      onClick={() => xr_store.getState().session.end()}
    />
  </Root>
}

const XROverlay = ({ onButtonClick }) => DEVICE.isMobile()
  ? <Mobile onButtonClick={onButtonClick} />
  : <HMD onButtonClick={onButtonClick} />

export { XROverlay }