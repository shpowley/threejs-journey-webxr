import { useCallback, useRef } from 'react'

import { isMobile, openDialog, closeDialog, metaQuestWebLaunch } from '../common/Utils'

const is_mobile_device = isMobile()

const DOMOverlay = () => {
    const refs = {
        modal_vr: useRef(),
        div_info: useRef(),
        div_qr: useRef()
    }

    const handlers = {
        openModal: useCallback(() => {
            refs.div_info.current.style.display = 'block'
            refs.div_qr.current.style.display = 'none'
            openDialog(refs.modal_vr.current)
        }, []),

        closeModal: () => closeDialog(refs.modal_vr.current),

        showButtonContent: useCallback(content => {
            refs.div_info.current.style.display = content === refs.div_info.current ? 'block' : 'none'
            refs.div_qr.current.style.display = content === refs.div_qr.current ? 'block' : 'none'
        }, [])
    }

    return <>
        {/* scene title info */}
        <div id='title'>
            Portal Scene with R3F<br />
            <a href='https://threejs-journey.com'>three.js journey</a>
        </div>

        {/* VR icon "ready player one" */}
        <img
            id='image_vr'
            src='/ready.webp'

            onPointerDown={handlers.openModal}
        />

        {/* modal overlay */}
        <div
            id='modal_vr'
            className='modal'
            ref={refs.modal_vr}

            onPointerDown={handlers.closeModal}
        >
            <div
                id='dialog_vr'
                onPointerDown={e => e.stopPropagation()}
            >
                {/* close button */}
                <button
                    id='button_close'
                    className='button_color'
                >
                    <img
                        id='image_exit'
                        src='/close_small.svg'

                        onContextMenu={e => e.preventDefault()}
                        onPointerDown={handlers.closeModal}
                    />
                </button>

                {/* QR code content */}
                <div
                    id='div_qr_share'
                    ref={refs.div_qr}
                >
                    <img
                        id='image_qr_share'
                        src='/eyejack.webp'
                    />

                    <div id='text_share'>QR Code (Android or iOS)</div>
                </div>

                {/* info content */}
                <div
                    id='div_info'
                    ref={refs.div_info}
                >
                    <p>
                        <a href='https://threejs-journey.com'>three.js journey</a><br />
                        Become a Three.js developer
                    </p>
                    <p>
                        <a href='https://github.com/pmndrs/xr'>react-three/xr</a><br />
                        VR/AR for react-three-fiber
                    </p>
                    <p>
                        <a href='https://play.eyejack.xyz'>eyejack</a> webXR on iOS
                    </p>
                    <p>
                        <a href='https://fonts.google.com/icons'>google fonts</a> icons
                    </p>
                    <p>
                        <a href='https://github.com/shpowley/threejs-journey-webxr'>github</a> source code
                    </p>
                    <br />
                    <p>
                        refactored for VR/AR<br />
                        Sung Powley <a href='https://bsky.app/profile/sung-powley.bsky.social'>bluesky</a>
                    </p>

                </div>

                {/* VR mode buttons */}
                <div id='div_buttons'>
                    {
                        // disable vr mode on mobile (mobile vr is deprecated more or less, e.g. google cardboard)
                        !is_mobile_device && navigator?.xr?.isSessionSupported('immersive-vr') &&
                        <button
                            title='immersive VR experience'
                            className='button_color'
                            onClick={() => xr_store.enterVR()}
                        >
                            VR
                        </button>
                    }

                    {
                        navigator?.xr?.isSessionSupported('immersive-ar') &&
                        <button
                            title='mixed-reality experience'
                            className='button_color'
                            onClick={() => xr_store.enterAR()}
                        >
                            AR
                        </button>
                    }

                    <button
                        id='button_quest'
                        title='Quest browser Web Launch'
                        onClick={metaQuestWebLaunch}
                    />

                    <button className='button_color'>
                        <img
                            id='image_qr_code'
                            src='/qr_code.svg'
                            title='share QR code'
                            onPointerDown={() => handlers.showButtonContent(refs.div_qr.current)}
                            onContextMenu={e => e.preventDefault()}
                        />
                    </button>

                    <button className='button_color'>
                        <img
                            id='image_info'
                            src='/info.svg'
                            title='more info'
                            onPointerDown={() => handlers.showButtonContent(refs.div_info.current)}
                            onContextMenu={e => e.preventDefault()}
                        />
                    </button>
                </div>
            </div>
        </div>
    </>
}

export { DOMOverlay }