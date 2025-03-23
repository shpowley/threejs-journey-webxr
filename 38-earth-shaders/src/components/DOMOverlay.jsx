import { useCallback, useRef } from 'react'

import {
  DEVICE,
  WINDOW_MODE,
  appClipLaunch,
  closeDialog,
  getWindowMode,
  metaQuestWebLaunch,
  openDialog,
  toggleFullscreen
} from '../common/utils'

import { ResizeListener, useForceUpdate } from './ResizeListener'

const IMAGES = {
  FULLSCREEN: './overlay/fullscreen.svg',
  FULLSCREEN_EXIT: './overlay/fullscreen_exit.svg'
}

const DOMOverlay = ({ store }) => {
  const refs = {
    modal_info: useRef(),
    div_info: useRef(),
    div_qr: useRef(),
    fullscreen: useRef()
  }

  const fullscreen_state = getWindowMode()
  const forceUpdate = useForceUpdate()

  const handlers = {
    openModal: useCallback(() => {
      const is_headset = DEVICE.isHeadset()
      refs.div_info.current.style.display = is_headset ? 'block' : 'none'
      refs.div_qr.current.style.display = is_headset ? 'none' : 'block'
      openDialog(refs.modal_info.current)
    }, []),

    closeModal: () => closeDialog(refs.modal_info.current),

    showButtonContent: useCallback(content => {
      refs.div_info.current.style.display = content === refs.div_info.current ? 'block' : 'none'
      refs.div_qr.current.style.display = content === refs.div_qr.current ? 'block' : 'none'
    }, [])
  }

  return <>
    <ResizeListener onResize={forceUpdate} />

    <div id='tweakpane_container' />

    {/* scene title info */}
    <div id='title'>
      Earth Shaders (VR)<br />
      <a href='https://threejs-journey.com'>threejs-journey.com</a>
    </div>

    {/* menu */}
    <img
      id='image_menu'
      title='menu'
      src='./overlay/menu.svg'
      onClick={handlers.openModal}
    />

    {/* fullscreen */}
    {
      !DEVICE.isAppleMobile() &&
      <img
        ref={refs.fullscreen}
        id='image_fullscreen'
        title='fullscreen'
        src={fullscreen_state === WINDOW_MODE.FULLSCREEN_API ? IMAGES.FULLSCREEN_EXIT : IMAGES.FULLSCREEN}
        onClick={toggleFullscreen}
      />
    }

    {/* modal overlay */}
    <div
      id='modal_vr'
      className='modal'
      ref={refs.modal_info}

      onPointerDown={handlers.closeModal}
    >
      <div
        id='dialog_vr'
        onPointerDown={e => e.stopPropagation()}
      >
        {/* close button */}
        <button
          id='button_close'
          className='class_button_color'
          onClick={handlers.closeModal}
        />

        {/* QR code content */}
        <div
          id='div_qr_share'
          ref={refs.div_qr}
        >
          <img
            id='image_qr_share'
            src='./overlay/eyejack.webp'
          />

          <div id='text_share'>
            Scan the QR Code<br />
            (Android or iOS)
          </div>
        </div>

        {/* info content */}
        <div
          id='div_info'
          ref={refs.div_info}
        >
          <p>
            <a href='https://threejs-journey.com'>three.js journey</a><br />
            become a three.js developer
          </p>
          <p>
            <a href='https://github.com/pmndrs/xr'>react-three/xr</a><br />
            vr/ar for react-three-fiber
          </p>
          <p>
            <a href='https://play.eyejack.xyz'>eyejack</a> (app clips)<br />
            play webxr on ios
          </p>
          <p>
            <a href='https://fonts.google.com/icons'>google fonts</a> icons
          </p>
          <p>
            <a href='https://github.com/shpowley/threejs-journey-webxr'>github</a> source code
          </p>
          <br />
          <p>
            <a href='https://bsky.app/profile/sung-powley.bsky.social'>@sung-powley.bsky.social</a>
          </p>

        </div>

        {/* VR mode buttons */}
        <div id='div_buttons'>
          {
            // disable vr mode on mobile (mobile vr is deprecated more or less, e.g. google cardboard)
            !DEVICE.isMobile() && navigator?.xr?.isSessionSupported('immersive-vr') &&
            <button
              title='launch immersive-VR'
              className='class_button_color'
              onClick={() => store?.enterVR()}
            >
              VR
            </button>
          }

          {
            navigator?.xr?.isSessionSupported('immersive-ar') ?
              <button
                title='launch mixed-reality'
                className='class_button_color'
                onClick={() => store?.enterAR()}
              >
                AR
              </button> :

              DEVICE.isAppleMobile() &&
              <button
                id='button_eyejack'
                title='eyejack app clip'
                className='class_button_color'
                onClick={appClipLaunch}
              />
          }

          {
            // for quest headset..
            // - don't show 'quest web launch' -- already here
            // - don't show qr code -- no way of sharing/scanning in headset
            // - don't show info button -- redundant. info already displayed
            !DEVICE.isOculus() &&
            <>
              <button
                id='button_quest'
                title='Quest browser Web Launch'
                onClick={metaQuestWebLaunch}
              />

              <button
                id='button_qr_code'
                className='class_button_color'
                title='share QR code'
                onClick={() => handlers.showButtonContent(refs.div_qr.current)}
              />

              <button
                id='button_info'
                className='class_button_color'
                title='more info'
                onClick={() => handlers.showButtonContent(refs.div_info.current)}
              />
            </>
          }
        </div>
      </div>
    </div>
  </>
}

export { DOMOverlay }