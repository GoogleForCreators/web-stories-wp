/**
 * Returns an image of the first frame of a given video.
 *
 * @param {string} src Video src URL.
 * @return {Promise<string>} The extracted image in base64-encoded format.
 */
function getFirstFrameOfVideo( src ) {
	const video = document.createElement( 'video' );
	video.muted = true;
	video.crossOrigin = 'anonymous';
	video.preload = 'metadata';
	video.currentTime = 0.5; // Needed to seek forward.

	return new Promise( ( resolve, reject ) => {
		video.addEventListener( 'error', reject );

		video.addEventListener( 'canplay', () => {
			const canvas = document.createElement( 'canvas' );
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const ctx = canvas.getContext( '2d' );
			ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

			canvas.toBlob( resolve, 'image/jpeg' );
		} );

		video.src = src;
	} );
}

export default getFirstFrameOfVideo;
