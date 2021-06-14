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
import preloadImage from './preloadImage';
import getFirstFrameOfVideo from './getFirstFrameOfVideo';

/**
 * Helper function get the file name without the extension from a url.
 *
 * @param {string} url URL to file.
 * @return {string} File name without the extension.
 */
const getFileName = (url) =>
  url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

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

  /**
   * Uploads a poster file for a given video.
   *
   * Ensures the two are properly connected on the backend.
   */
  const uploadVideoPoster = useCallback(
    /**
     *
     * @param {number} id Video ID.
     * @param {string} fileName File name.
     * @param {File} posterFile File object.
     * @return {Promise<{posterHeight: *, posterWidth: *, poster: *, posterId: *}>} Poster information.
     */
    async (id, fileName, posterFile) => {
      // TODO: Make param mandatory; don't allow calling without.
      if (!posterFile) {
        return {};
      }
      // if blob given change name of file.
      if (!posterFile.name) {
        posterFile.name = fileName;
      }

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
    },
    [storyId, updateMedia, uploadFile]
  );

  /**
   * Uploads the video's first frame as its poster image.
   *
   * Updates the resource both in the media library and on the canvas
   * to include the new poster image reference.
   */
  const uploadVideoFrame = useCallback(
    /**
     *
     * @param {number} id Video ID.
     * @param {string} src Video URL.
     * @return {Promise<void>}
     */
    async (id, src) => {
      const trackTiming = getTimeTracker('load_video_poster');
      try {
        const fileName = getFileName(src) + '-poster.jpeg';
        const obj = await getFirstFrameOfVideo(src);
        const { posterId, poster, posterWidth, posterHeight } =
          await uploadVideoPoster(id, fileName, obj);

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
    },
    [uploadVideoPoster, updateMediaElement, setProperties]
  );

  return {
    uploadVideoFrame,
    uploadVideoPoster,
  };
}

export default useUploadVideoFrame;
