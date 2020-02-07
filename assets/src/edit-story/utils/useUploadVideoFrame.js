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
import { useUploader } from '../app/uploader';
import getFirstFrameOfVideo from './getFirstFrameOfVideo';

function useUploadVideoFrame({ videoId, src, id }) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const { uploadFile } = useUploader({ refreshLibrary: false });
  const { storyId } = useConfig();
  const {
    actions: { updateElementById },
  } = useStory();
  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const processData = async () => {
    try {
      const obj = await getFirstFrameOfVideo(src);
      const { id: posterId, source_url: poster } = await uploadFile(obj);
      await updateMedia(posterId, {
        meta: {
          web_stories_is_poster: true,
        },
      });
      await updateMedia(videoId, {
        featured_media: posterId,
        post: storyId,
      });
      const newState = { posterId, poster };
      setProperties(newState);
    } catch (err) {
      // TODO Display error message to user as video poster upload has as failed.
    }
  };

  /**
   * Uploads the video's first frame as an attachment.
   *
   */
  const uploadVideoFrame = useCallback(processData, [
    getFirstFrameOfVideo,
    src,
    uploadFile,
    updateMedia,
    videoId,
    setProperties,
  ]);

  return {
    uploadVideoFrame,
  };
}

export default useUploadVideoFrame;
