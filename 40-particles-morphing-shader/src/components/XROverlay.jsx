import { Container, Fullscreen, Root, Svg, Text } from '@react-three/uikit'
import { Button } from '@react-three/uikit-default'
import { useXRStore } from '@react-three/xr'

import { DEVICE } from '../common/utils'
import { BUTTONS } from './TweakPaneControls'

const BUTTON = {
  HEIGHT: 80,
  WIDTH: 160
}

const XRButton = ({ text, positionType = 'relative', positionBottom, backgroundColor = 0x67b0ff, onClick }) => <Button
  variant='ghost'
  positionType={positionType}
  positionBottom={positionBottom}
  backgroundColor={backgroundColor}
  hover={{ backgroundColor: 0x5ee07b }}
  height={BUTTON.HEIGHT}
  width={BUTTON.WIDTH}
  onClick={onClick}
>
  <Text
    fontSize={24}
    children={text}
  />
</Button>

const Mobile = ({ onButtonClick }) => {
  const getWindowMinimumSize = () => Math.min(window.innerHeight, window.innerWidth)
  const MARGIN = 2 * Math.max(getWindowMinimumSize() * 0.025, 16)

  const xr_store = useXRStore()

  return <Fullscreen
    pointerEvents='listener'
    alignItems='center'
    justifyContent='center'
    depthTest={false}
  >
    <Container
      alignItems='center'
      justifyContent='center'
      width={window.innerWidth - MARGIN}
      height={window.innerHeight - MARGIN}
    >
      <Button
        variant='ghost'
        aspectRatio={1}
        backgroundOpacity={0.5}
        height={30}
        padding={0}
        positionType='absolute'
        positionLeft={0}
        positionTop={DEVICE.isAppleMobile() ? 10 : 0}
        onClick={() => xr_store.getState().session.end()}
      >
        <Svg
          src='./overlay/close_small.svg'
          color={0xffffff}
          height='100%'
          hover={{ transformScale: 1.3 }}
        />
      </Button>
      <Container
        positionType='absolute'
        positionBottom={0}
        alignItems='center'
        justifyContent='center'
        transformScale={0.52}
      >
        <Container
          positionType='absolute'
          positionBottom={0}
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
      </Container>
    </Container>
  </Fullscreen>
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