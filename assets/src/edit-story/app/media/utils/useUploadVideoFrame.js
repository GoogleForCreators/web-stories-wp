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
import { getTimeTracker, trackError } from '@web-stories-wp/tracking';
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
  const {
    actions: { uploadFile },
  } = useUploader();
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

  async function processPoster(id, fileName, posterFile) {
    if (!posterFile) {
      return {};
    }
    posterFile.name = fileName;
    const {
      id: posterId,
      source_url: poster,
      media_details: { width: posterWidth, height: posterHeight },
    } = await uploadFile(posterFile, {
      post: id,
      media_source: 'poster-generation',
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

    return { posterId, poster, posterWidth, posterHeight };
  }

  const processData = async (id, src) => {
    const trackTiming = getTimeTracker('load_video_poster');
    try {
      const fileName = getFileName(src) + '-poster.jpeg';
      const obj = await getFirstFrameOfVideo(src);
      const {
        posterId,
        poster,
        posterWidth,
        posterHeight,
      } = await processPosterData(id, fileName, obj);

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
        data: {
          posterId,
          poster,
          ...newSize,
        },
      });
    } catch (err) {
      // TODO: Potentially display error message to user.
      trackError('video_poster_generation', err.message);
    } finally {
      trackTiming();
    }
  };

  /**
   * Helper function get the file name without the extension from a url.
   *
   * @param {string} url URL to file.
   * @return {string} File name without the extension.
   */
  const getFileName = (url) =>
    url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

  /**
   * Make api requests to upload poster image and update attachment data.
   *
   */
  const processPosterData = useCallback(processPoster, [
    uploadFile,
    updateMedia,
    storyId,
  ]);

  /**
   * Uploads the video's first frame as an attachment.
   *
   */
  const uploadVideoFrame = useCallback(processData, [
    processPosterData,
    setProperties,
    updateMediaElement,
  ]);

  return {
    uploadVideoFrame,
    processPosterData,
  };
}

export default useUploadVideoFrame;
