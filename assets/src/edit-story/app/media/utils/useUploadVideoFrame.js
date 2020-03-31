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
import getFirstFrameOfVideo from './getFirstFrameOfVideo';

function useUploadVideoFrame({ updateMediaElement }) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const { uploadFile } = useUploader(false);
  const { storyId } = useConfig();
  const {
    state: { currentPage },
    actions: { updateElementById },
  } = useStory();
  const setProperties = useCallback(
    (elementId, properties) => updateElementById({ elementId, properties }),
    [updateElementById]
  );

  const processData = async (videoId, src) => {
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
      currentPage.elements.forEach((element) => {
        if (
          element &&
          element.resource &&
          element.resource.videoId === videoId
        ) {
          const newState = {
            resource: { ...element.resource, posterId, poster },
          };
          setProperties(element.id, newState);
        }
      });
      updateMediaElement({ videoId, posterId, poster });
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
    uploadFile,
    updateMedia,
    setProperties,
  ]);

  return {
    uploadVideoFrame,
  };
}

export default useUploadVideoFrame;
