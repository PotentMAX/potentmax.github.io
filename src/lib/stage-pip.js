let pipVideo = null;
let pipStream = null;

const openStagePiP = async vm => {
    const canvas = vm.renderer && vm.renderer.canvas;

    if (!canvas) {
        console.error('Scratch stage canvas not found.');
        return;
    }

    if (!document.pictureInPictureEnabled ||
        typeof canvas.captureStream !== 'function') {
        console.error('Picture-in-Picture is not supported.');
        return;
    }

    try {
        // Close an existing PiP window first.
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        }

        // Capture the live Scratch renderer.
        pipStream = canvas.captureStream(30);

        pipVideo = document.createElement('video');
        pipVideo.srcObject = pipStream;
        pipVideo.muted = true;
        pipVideo.autoplay = true;
        pipVideo.playsInline = true;

        await pipVideo.play();
        await pipVideo.requestPictureInPicture();

        pipVideo.addEventListener('leavepictureinpicture', () => {
            pipStream?.getTracks().forEach(track => track.stop());
            pipStream = null;
            pipVideo = null;
        }, {once: true});
    } catch (error) {
        console.error('Could not open stage PiP:', error);

        pipStream?.getTracks().forEach(track => track.stop());
        pipStream = null;
        pipVideo = null;
    }
};

export default openStagePiP;
