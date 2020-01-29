/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useAPI } from '../app/api';
import { useStory } from '../app/story';
import { useConfig } from '../app/config';
import getFirstFrameOfVideo from './getFirstFrameOfVideo';

function useUploadVideoFrame( { videoId, src, id } ) {
	const { actions: { uploadMedia, saveMedia } } = useAPI();
	const { storyId } = useConfig();
	const { actions: { updateElementById } } = useStory();
	const setProperties = useCallback(
		( properties ) => updateElementById( { elementId: id, properties } ),
		[ id, updateElementById ] );

	const processData = async () => {
		try {
			const obj = await getFirstFrameOfVideo( src );
			const { id: featuredMedia, source_url: poster } = await uploadMedia( obj );
			await saveMedia( featuredMedia, {
				meta: {
					web_stories_is_poster: true,
				},
				post: storyId,
			} );
			await saveMedia( videoId, {
				featured_media: featuredMedia,
				post: storyId,
			} );
			const newState = { featuredMedia, poster };
			setProperties( newState );
		} catch ( err ) {
			// TODO Display error message to user as video poster upload has as failed.
		}
	};

	/**
	 * Uploads the video's first frame as an attachment.
	 *
	 */
	const uploadVideoFrame = useCallback( processData, [ getFirstFrameOfVideo, src, uploadMedia, saveMedia, videoId, setProperties ] );

	return {
		uploadVideoFrame,
	};
}

export default useUploadVideoFrame;
