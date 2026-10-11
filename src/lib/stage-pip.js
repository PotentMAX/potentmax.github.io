let pipVideo = null;
let pipStream = null;
let pipFrameInterval = null;
let pipVisibilityHandler = null;

const openStagePiP = async vm => {
    const canvas = vm.renderer && vm.renderer.canvas;

    if (!canvas) {
        console.error('Scratch stage canvas not found.');
        return;
    }

    if (
        !document.pictureInPictureEnabled ||
        typeof canvas.captureStream !== 'function'
    ) {
        console.error('Picture-in-Picture is not supported.');
        return;
    }

    try {
        // Close an existing PiP window first.
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        }

        // Capture frames manually.
        pipStream = canvas.captureStream(0);

        const track = pipStream.getVideoTracks()[0];

        pipVideo = document.createElement('video');
        pipVideo.srcObject = pipStream;
        pipVideo.muted = true;
        pipVideo.autoplay = true;
        pipVideo.playsInline = true;

        await pipVideo.play();
        await pipVideo.requestPictureInPicture();

        // Request canvas frames while PiP is active.
        // Note: this captures the current canvas; it does not
        // force Scratch's renderer to produce new frames.
        pipFrameInterval = window.setInterval(() => {
            if (
                document.pictureInPictureElement === pipVideo &&
                track &&
                typeof track.requestFrame === 'function'
            ) {
                track.requestFrame();
            }
        }, 1000 / 30);

        // Clean up when PiP closes.
        pipVideo.addEventListener('leavepictureinpicture', () => {
            if (pipFrameInterval !== null) {
                window.clearInterval(pipFrameInterval);
                pipFrameInterval = null;
            }

            if (pipVisibilityHandler) {
                document.removeEventListener(
                    'visibilitychange',
                    pipVisibilityHandler
                );
                pipVisibilityHandler = null;
            }

            pipStream?.getTracks().forEach(track => track.stop());
            pipStream = null;
            pipVideo = null;
        }, {once: true});
    } catch (error) {
        console.error('Could not open stage PiP:', error);

        if (pipFrameInterval !== null) {
            window.clearInterval(pipFrameInterval);
            pipFrameInterval = null;
        }

        pipStream?.getTracks().forEach(track => track.stop());
        pipStream = null;
        pipVideo = null;
    }
};

export default openStagePiP;
