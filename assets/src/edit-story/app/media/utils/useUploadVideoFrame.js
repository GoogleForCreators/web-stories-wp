/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import { useUploader } from '../../uploader';
import { preloadImage, getFirstFrameOfVideo } from './';

function useUploadVideoFrame({ updateMediaElement }) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const { uploadFile } = useUploader();
  const { storyId } = useConfig();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));
  const setProperties = useCallback(
    (id, properties) => {
      updateElementsByResourceId({ id, properties });
    },
    [updateElementsByResourceId]
  );

  const processData = async (id, src) => {
    try {
      const obj = await getFirstFrameOfVideo(src);
      const {
        id: posterId,
        source_url: poster,
        media_details: { width: posterWidth, height: posterHeight },
      } = await uploadFile(obj);
      // Meta data cannot be sent as part of upload.
      await updateMedia(posterId, {
        meta: {
          web_stories_is_poster: true,
        },
      });
      await updateMedia(id, {
        featured_media: posterId,
        meta: {
          web_stories_poster_id: posterId,
        },
        post: storyId,
      });

      // Preload the full image in the browser to stop jumping around.
      await preloadImage(poster);

      // Overwrite the original video dimensions. The poster reupload has more
      // accurate dimensions of the video that includes orientation changes.
      const newSize =
        (posterWidth &&
          posterHeight && {
            width: posterWidth,
            height: posterHeight,
          }) ||
        null;
      const newState = ({ resource }) => ({
        resource: {
          ...resource,
          posterId,
          poster,
          ...newSize,
        },
      });
      setProperties(id, newState);
      updateMediaElement({
        id,
        posterId,
        poster,
        ...newSize,
      });
    } catch (err) {
      // TODO Display error message to user as video poster upload has as failed.
    }
  };

  /**
   * Uploads the video's first frame as an attachment.
   *
   */
  const uploadVideoFrame = useCallback(processData, [
    storyId,
    updateMediaElement,
    uploadFile,
    updateMedia,
    setProperties,
  ]);

  return {
    uploadVideoFrame,
  };
}

export default useUploadVideoFrame;
