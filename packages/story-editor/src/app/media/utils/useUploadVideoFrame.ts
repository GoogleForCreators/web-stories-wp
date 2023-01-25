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
import { useCallback } from '@googleforcreators/react';
import { getTimeTracker, trackError } from '@googleforcreators/tracking';
import {
  preloadImage,
  getFirstFrameOfVideo,
  getFileNameFromUrl,
  getFileBasename,
  blobToFile,
} from '@googleforcreators/media';
import type { ResourceId } from '@googleforcreators/media';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import { useUploader } from '../../uploader';
import { MEDIA_POSTER_IMAGE_MIME_TYPE } from '../../../constants';
import getPosterName from './getPosterName';

interface UseUploadVideoFrameProps {
  updateMediaElement: (props: {
    id: number;
    data: {
      posterId?: ResourceId;
      poster?: string;
      width?: number;
      height?: number;
    };
  }) => void;
}

function useUploadVideoFrame({ updateMediaElement }: UseUploadVideoFrameProps) {
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

  /**
   * Uploads a poster file.
   *
   * If the poster is for a local video, ensures the two are properly connected on the backend.
   */
  const uploadVideoPoster = useCallback(
    /**
     *
     * @param id Video ID.
     * @param posterFile File object.
     * @return Poster information.
     */
    async (id: ResourceId, posterFile: File | null) => {
      // TODO: Make param mandatory; don't allow calling without.
      if (!posterFile) {
        return {};
      }

      const resource = await uploadFile(posterFile, {
        mediaId: id,
        mediaSource: 'poster-generation',
      });
      const {
        id: posterId,
        src: poster,
        width: posterWidth,
        height: posterHeight,
      } = resource;

      // If video ID is not set, skip relating media.
      if (id && updateMedia) {
        await updateMedia(id, {
          posterId,
          storyId,
        });
      }

      // Preload the full image in the browser to stop jumping around.
      try {
        await preloadImage({ src: poster });
      } catch {
        // Ignore
      }

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
     * @param id Video ID.
     * @param src Video URL.
     */
    async (id: number, src: string) => {
      const trackTiming = getTimeTracker('load_video_poster');
      try {
        const originalFileName = getFileNameFromUrl(src);
        const fileName = getPosterName(
          getFileBasename({ name: originalFileName })
        );
        const blob = await getFirstFrameOfVideo(src);
        const posterFile = blob
          ? blobToFile(blob, fileName, MEDIA_POSTER_IMAGE_MIME_TYPE)
          : null;
        const { posterId, poster, posterWidth, posterHeight } =
          await uploadVideoPoster(id, posterFile);

        // Overwrite the original video dimensions. The poster reupload has more
        // accurate dimensions of the video that includes orientation changes.
        const newSize =
          (posterWidth &&
            posterHeight && { width: posterWidth, height: posterHeight }) ||
          {};
        if (updateElementsByResourceId) {
          updateElementsByResourceId({
            id,
            properties: ({ resource }) => ({
              resource: {
                ...resource,
                posterId,
                poster,
                ...newSize,
              },
            }),
          });
        }
        if (updateMediaElement) {
          updateMediaElement({
            id,
            data: {
              posterId,
              poster,
              ...newSize,
            },
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          // TODO: Potentially display error message to user.
          void trackError('video_poster_generation', err.message);
        }
      } finally {
        trackTiming();
      }
    },
    [uploadVideoPoster, updateElementsByResourceId, updateMediaElement]
  );

  return {
    uploadVideoFrame,
    uploadVideoPoster,
  };
}

export default useUploadVideoFrame;
