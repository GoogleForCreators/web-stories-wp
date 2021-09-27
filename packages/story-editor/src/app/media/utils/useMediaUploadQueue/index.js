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
import {
  useEffect,
  useCallback,
  useMemo,
  useReduction,
} from '@web-stories-wp/react';
import {
  trackError,
  trackEvent,
  getTimeTracker,
} from '@web-stories-wp/tracking';
import {
  createBlob,
  getFileName,
  getImageDimensions,
  isAnimatedGif,
} from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { useUploader } from '../../../uploader';
import { noop } from '../../../../utils/noop';
import useUploadVideoFrame from '../useUploadVideoFrame';
import useFFmpeg from '../useFFmpeg';
import getResourceFromLocalFile from '../getResourceFromLocalFile';
import * as reducer from './reducer';

const initialState = {
  queue: [],
};

function useMediaUploadQueue() {
  const {
    actions: { uploadFile },
  } = useUploader();
  const {
    isTranscodingEnabled,
    canTranscodeFile,
    transcodeVideo,
    stripAudioFromVideo,
    getFirstFrameOfVideo,
    convertGifToVideo,
    trimVideo,
  } = useFFmpeg();

  const [state, actions] = useReduction(initialState, reducer);
  const { uploadVideoPoster } = useUploadVideoFrame({
    updateMediaElement: noop,
  });
  const {
    startUploading,
    finishUploading,
    cancelUploading,
    startTranscoding,
    startMuting,
    startTrimming,
    finishTranscoding,
    finishMuting,
    finishTrimming,
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
            const { resource: newResource, posterFile } =
              await getResourceFromLocalFile(file);

            replacePlaceholderResource({
              id,
              resource: newResource,
              posterFile,
            });
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

          if (!isTranscodingEnabled || !canTranscodeFile(file)) {
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
            replacePlaceholderResource({
              id,
              resource: newResource,
              posterFile: videoFrame,
            });
          } catch {
            // Not interested in errors here.
          }
        })
      );
    }

    updateItems();
  }, [
    state.queue,
    isTranscodingEnabled,
    canTranscodeFile,
    getFirstFrameOfVideo,
    replacePlaceholderResource,
  ]);

  const processPoster = useCallback(
    async ({ newResource, posterFileName, newPosterFile, resource, id }) => {
      try {
        const { poster, posterId } = await uploadVideoPoster(
          newResource.id,
          posterFileName,
          newPosterFile
        );

        let newResourceWithPoster = {
          ...newResource,
          poster: poster || newResource.poster || resource.poster,
          posterId,
        };

        if (resource.mimeType === 'image/gif') {
          newResourceWithPoster = {
            ...newResourceWithPoster,
            output: {
              ...newResourceWithPoster.output,
              poster: poster || newResource.poster || resource.poster,
            },
          };
        }

        finishUploading({
          id,
          resource: newResourceWithPoster,
        });
      } catch (error) {
        finishUploading({
          id,
          resource: newResource,
        });
      }
    },
    [finishUploading, uploadVideoPoster]
  );

  // Upload files to server, optionally first transcoding them.
  useEffect(() => {
    async function uploadItems() {
      await Promise.all(
        /**
         * Uploads a single pending item.
         *
         * @param {Object} item Queue item.
         * @param {File} item.file File object.
         * @return {Promise<void>}
         */
        state.queue.map(async (item) => {
          const {
            id,
            file,
            state: itemState,
            resource,
            additionalData = {},
            posterFile,
            muteVideo,
            trimData,
          } = item;
          if ('PENDING' !== itemState) {
            return;
          }

          const posterFileName = getFileName(file) + '-poster.jpeg';

          let newResource;
          let newFile = file;
          let newPosterFile = posterFile;

          // Convert animated GIFs to videos if possible.
          if (
            isTranscodingEnabled &&
            resource.mimeType === 'image/gif' &&
            isAnimatedGif(await file.arrayBuffer())
          ) {
            startTranscoding({ id });

            try {
              newFile = await convertGifToVideo(file);
              finishTranscoding({ id, file: newFile });
              additionalData.media_source = 'gif-conversion';
              additionalData.is_muted = true;
            } catch (error) {
              // Cancel uploading if there were any errors.
              cancelUploading({ id, error });

              trackError('upload_media', error?.message);

              return;
            }

            try {
              newPosterFile = await getFirstFrameOfVideo(newFile);
            } catch (error) {
              // Do nothing here.
            }
          }

          // Transcode/Optimize videos before upload.
          // TODO: Only transcode & optimize video if needed (criteria TBD).
          // Probably need to use FFmpeg first to get more information (dimensions, fps, etc.)
          if (isTranscodingEnabled && canTranscodeFile(file)) {
            if (trimData) {
              startTrimming({ id });
              try {
                newFile = await trimVideo(file, trimData.start, trimData.end);
                finishTrimming({ id, file: newFile });
                additionalData.meta = {
                  web_stories_trim_data: trimData,
                };
              } catch (error) {
                // Cancel uploading if there were any errors.
                cancelUploading({ id, error });

                trackError('upload_media', error?.message);

                return;
              }
            } else if (muteVideo) {
              startMuting({ id });
              try {
                newFile = await stripAudioFromVideo(file);
                finishMuting({ id, file: newFile });
                additionalData.is_muted = true;
              } catch (error) {
                // Cancel uploading if there were any errors.
                cancelUploading({ id, error });

                trackError('upload_media', error?.message);

                return;
              }
            } else {
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
          }

          startUploading({ id });

          trackEvent('upload_media', {
            file_size: newFile.size,
            file_type: newFile.type,
          });

          const trackTiming = getTimeTracker('load_upload_media');

          try {
            // The newly uploaded file won't have a poster yet.
            // However, we'll likely still have one on file.
            // Add it back so we're never without one.
            // The final poster will be uploaded later by uploadVideoPoster().
            newResource = await uploadFile(newFile, additionalData);
          } catch (error) {
            // Cancel uploading if there were any errors.
            cancelUploading({ id, error });

            trackError('upload_media', error?.message);
          } finally {
            trackTiming();
          }

          if (newResource?.id) {
            await processPoster({
              newResource,
              posterFileName,
              newPosterFile,
              resource,
              id,
            });
          }
        })
      );
    }

    uploadItems();
  }, [
    state.queue,
    cancelUploading,
    uploadFile,
    startUploading,
    processPoster,
    startTranscoding,
    finishTranscoding,
    isTranscodingEnabled,
    getFirstFrameOfVideo,
    canTranscodeFile,
    transcodeVideo,
    stripAudioFromVideo,
    convertGifToVideo,
    startMuting,
    finishMuting,
    trimVideo,
    startTrimming,
    finishTrimming,
  ]);

  return useMemo(
    () => ({
      state: {
        progress: state.queue.filter(
          (item) => !['UPLOADED', 'CANCELLED', 'PENDING'].includes(item.state)
        ),
        pending: state.queue.filter((item) => item.state === 'PENDING'),
        uploaded: state.queue.filter((item) => item.state === 'UPLOADED'),
        failures: state.queue.filter((item) => item.state === 'CANCELLED'),
        isUploading: state.queue.some(
          (item) => !['UPLOADED', 'CANCELLED', 'PENDING'].includes(item.state)
        ),
        isTranscoding: state.queue.some((item) => item.state === 'TRANSCODING'),
        isMuting: state.queue.some((item) => item.state === 'MUTING'),
        isTrimming: state.queue.some((item) => item.state === 'TRIMMING'),
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
