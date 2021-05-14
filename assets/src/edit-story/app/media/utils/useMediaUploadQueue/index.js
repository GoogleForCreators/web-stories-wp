/*
 * Copyright 2021 Google LLC
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
import { useEffect, useMemo } from 'react';
import {
  trackError,
  trackEvent,
  getTimeTracker,
} from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useUploader } from '../../../uploader';
import useReduction from '../../../../utils/useReduction';
import { createBlob } from '../../../../utils/blobs';
import useFFmpeg from '../useFFmpeg';
import getResourceFromAttachment from '../getResourceFromAttachment';
import getResourceFromLocalFile from '../getResourceFromLocalFile';
import getImageDimensions from '../getImageDimensions';
import isAnimatedGif from '../isAnimatedGif';
import * as reducer from './reducer';

const initialState = {
  queue: [],
};

function useMediaUploadQueue() {
  const {
    actions: { uploadFile },
  } = useUploader();
  const {
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    transcodeVideo,
    getFirstFrameOfVideo,
    convertGifToVideo,
  } = useFFmpeg();

  const [state, actions] = useReduction(initialState, reducer);
  const {
    startUploading,
    finishUploading,
    cancelUploading,
    startTranscoding,
    finishTranscoding,
    replacePlaceholderResource,
  } = actions;

  // Try to update placeholder resources for freshly transcoded file if still missing.
  useEffect(() => {
    async function updateItems() {
      await Promise.all(
        state.queue.map(async (item) => {
          const { id, file, state: itemState, resource } = item;
          if (
            itemState !== 'TRANSCODED' ||
            !resource.isPlaceholder ||
            resource.poster
          ) {
            return;
          }

          try {
            const newResource = await getResourceFromLocalFile(file);
            replacePlaceholderResource({ id, resource: newResource });
          } catch {
            // Not interested in errors here.
          }
        })
      );
    }

    updateItems();
  }, [state.queue, replacePlaceholderResource]);

  // Try to get dimensions and poster for placeholder resources.
  // This way we can show something more meaningful to the user before transcoding has finished.
  useEffect(() => {
    async function updateItems() {
      await Promise.all(
        state.queue.map(async (item) => {
          const { id, file, state: itemState, resource } = item;
          if ('PENDING' !== itemState || !resource.isPlaceholder) {
            return;
          }

          if (
            !isFeatureEnabled ||
            !isTranscodingEnabled ||
            !canTranscodeFile(file)
          ) {
            return;
          }

          try {
            const videoFrame = await getFirstFrameOfVideo(file);
            const poster = createBlob(videoFrame);
            const { width, height } = await getImageDimensions(poster);
            const newResource = {
              ...resource,
              poster,
              width,
              height,
            };
            replacePlaceholderResource({ id, resource: newResource });
          } catch {
            // Not interested in errors here.
          }
        })
      );
    }

    updateItems();
  }, [
    state.queue,
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    getFirstFrameOfVideo,
    replacePlaceholderResource,
  ]);

  // Upload files to server, optionally first transcoding them.
  useEffect(() => {
    async function uploadItems() {
      await Promise.all(
        state.queue.map(
          /**
           * Uploads a single pending item.
           *
           * @param {Object} item Queue item.
           * @param {File} item.file File object.
           * @return {Promise<void>}
           */
          async (item) => {
            const {
              id,
              file,
              state: itemState,
              resource,
              additionalData = {},
            } = item;
            if ('PENDING' !== itemState) {
              return;
            }

            let newFile = file;

            // Convert animated GIFs to videos if possible.
            if (
              resource.mimeType === 'image/gif' &&
              isAnimatedGif(await file.arrayBuffer()) &&
              isFeatureEnabled &&
              isTranscodingEnabled
            ) {
              startTranscoding({ id });

              try {
                newFile = await convertGifToVideo(file);
                finishTranscoding({ id, file: newFile });
                additionalData.media_source = 'gif-conversion';
              } catch (error) {
                // Cancel uploading if there were any errors.
                cancelUploading({ id, error });

                trackError('upload_media', error?.message);

                return;
              }
            }

            // Transcode/Optimize videos before upload.
            // TODO: Only transcode & optimize video if needed (criteria TBD).
            // Probably need to use FFmpeg first to get more information (dimensions, fps, etc.)
            if (
              isFeatureEnabled &&
              isTranscodingEnabled &&
              canTranscodeFile(file)
            ) {
              startTranscoding({ id });

              try {
                newFile = await transcodeVideo(file);
                finishTranscoding({ id, file: newFile });
                additionalData.media_source = 'video-optimization';
              } catch (error) {
                // Cancel uploading if there were any errors.
                cancelUploading({ id, error });

                trackError('upload_media', error?.message);

                return;
              }
            }

            startUploading({ id });

            trackEvent('upload_media', {
              file_size: newFile.size,
              file_type: newFile.type,
            });

            const trackTiming = getTimeTracker('load_upload_media');

            try {
              const attachment = await uploadFile(newFile, additionalData);

              // The newly uploaded file won't have a poster yet.
              // However, we'll likely still have one on file.
              // Add it back so we're never without one.
              // The final poster will be uploaded later by uploadVideoPoster().
              const newResource = getResourceFromAttachment(attachment);
              const newResourceWithPoster = {
                ...newResource,
                poster: newResource.poster || resource.poster,
              };

              finishUploading({
                id,
                resource: newResourceWithPoster,
              });
            } catch (error) {
              // Cancel uploading if there were any errors.
              cancelUploading({ id, error });

              trackError('upload_media', error?.message);
            } finally {
              trackTiming();
            }
          }
        )
      );
    }

    uploadItems();
  }, [
    state.queue,
    cancelUploading,
    uploadFile,
    startUploading,
    finishUploading,
    startTranscoding,
    finishTranscoding,
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    transcodeVideo,
    convertGifToVideo,
  ]);

  return useMemo(
    () => ({
      state: {
        progress: state.queue.filter(
          (item) => !['UPLOADED', 'CANCELLED', 'PENDING'].includes(item.state)
        ),
        pending: state.queue.filter((item) => item.state === 'PENDING'),
        processed: state.queue.filter((item) => item.state === 'UPLOADED'),
        failures: state.queue.filter((item) => item.state === 'CANCELLED'),
        isUploading: state.queue.some((item) =>
          ['PENDING', 'UPLOADING', 'TRANSCODING'].includes(item.state)
        ),
        isTranscoding: state.queue.some((item) => item.state === 'TRANSCODING'),
      },
      actions: {
        addItem: actions.addItem,
        removeItem: actions.removeItem,
      },
    }),
    [state, actions]
  );
}

export default useMediaUploadQueue;
