let pipVideo = null;
let pipStream = null;
let pipFrameInterval = null;

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
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        }

        pipStream = canvas.captureStream(0);
        const track = pipStream.getVideoTracks()[0];

        pipVideo = document.createElement('video');
        pipVideo.srcObject = pipStream;
        pipVideo.muted = true;
        pipVideo.autoplay = true;
        pipVideo.playsInline = true;

        await pipVideo.play();
        await pipVideo.requestPictureInPicture();

        pipFrameInterval = window.setInterval(() => {
            if (document.pictureInPictureElement !== pipVideo) {
                return;
            }

            try {
                // Ask the VM to redraw its current stage.
                if (vm.runtime && typeof vm.runtime.requestRedraw === 'function') {
                    vm.runtime.requestRedraw();
                }

                // Capture the latest canvas contents.
                if (track && typeof track.requestFrame === 'function') {
                    track.requestFrame();
                }
            } catch (error) {
                console.warn('PiP frame update failed:', error);
            }
        }, 1000 / 30);

        pipVideo.addEventListener('leavepictureinpicture', () => {
            if (pipFrameInterval !== null) {
                window.clearInterval(pipFrameInterval);
                pipFrameInterval = null;
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
