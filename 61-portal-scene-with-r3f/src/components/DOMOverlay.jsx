import { useCallback, useRef } from 'react'

import {
    appClipLaunch,
    closeDialog,
    isAppleMobile,
    isMobile,
    isOculusUserAgent,
    metaQuestWebLaunch,
    openDialog
} from '../common/Utils'

const DOMOverlay = ({ xr_store }) => {
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
                        src='/eyejack.webp'
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
                        refactored for webxr<br />
                        sung powley <a href='https://bsky.app/profile/sung-powley.bsky.social'>bluesky</a>
                    </p>

                </div>

                {/* VR mode buttons */}
                <div id='div_buttons'>
                    {
                        // disable vr mode on mobile (mobile vr is deprecated more or less, e.g. google cardboard)
                        !isMobile() && navigator?.xr?.isSessionSupported('immersive-vr') &&
                        <button
                            title='launch immersive-VR'
                            className='class_button_color'
                            onClick={() => xr_store?.enterVR()}
                        >
                            VR
                        </button>
                    }

                    {
                        navigator?.xr?.isSessionSupported('immersive-ar') ?
                            <button
                                title='launch mixed-reality'
                                className='class_button_color'
                                onClick={() => xr_store?.enterAR()}
                            >
                                AR
                            </button> :

                            isAppleMobile() &&
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
                        !isOculusUserAgent() &&
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