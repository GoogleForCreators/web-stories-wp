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
import useTranscodeVideo from '../useTranscodeVideo';
import getResourceFromAttachment from '../getResourceFromAttachment';
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
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    transcodeVideo,
  } = useTranscodeVideo();

  const [state, actions] = useReduction(initialState, reducer);
  const {
    startUploading,
    finishUploading,
    cancelUploading,
    startTranscoding,
    finishTranscoding,
    replacePlaceholderResource,
  } = actions;

  // TODO: add effect to generate poster via ffmpeg in case resource lacks dimensions.
  // See https://github.com/google/web-stories-wp/issues/6399

  // Try to update placeholder resources for freshly transcoded file.
  useEffect(() => {
    async function updateItems() {
      await Promise.all(
        state.queue.map(async (item) => {
          const { id, file, state: itemState, resource } = item;
          if (itemState !== 'TRANSCODED' || !resource.isPlaceholder) {
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

  // Upload files to server, optionally first transcoding them.
  useEffect(() => {
    async function uploadItems() {
      await Promise.all(
        state.queue.map(async (item) => {
          const { id, file, state: itemState } = item;
          if ('PENDING' !== itemState) {
            return;
          }

          if (
            !isFeatureEnabled ||
            !isTranscodingEnabled ||
            !canTranscodeFile(file)
          ) {
            // TODO: If !isTranscodingEnabled && canTranscodeFile(), tell user to enable transcoding.

            // If transcoding is not enabled, just upload the file normally without any transcoding.

            startUploading({ id });

            trackEvent('upload_media', {
              file_size: file.size,
              file_type: file.type,
            });

            const trackTiming = getTimeTracker('load_upload_media');

            try {
              const attachment = await uploadFile(file);
              finishUploading({
                id,
                resource: getResourceFromAttachment(attachment),
              });
            } catch (error) {
              // Cancel uploading if there were any errors.
              cancelUploading({ id, error });

              trackError('upload_media', error?.message);
            } finally {
              trackTiming();
            }

            return;
          }

          // TODO: Only transcode & optimize video if needed (criteria TBD).
          // Probably need to use FFmpeg first to get more information (dimensions, fps, etc.)
          startTranscoding({ id });

          try {
            const newFile = await transcodeVideo(file);
            finishTranscoding({ id, file: newFile });

            startUploading({ id });

            const attachment = await uploadFile(newFile, {
              media_source: 'video-optimization',
            });

            finishUploading({
              id,
              resource: getResourceFromAttachment(attachment),
            });
          } catch (error) {
            // Cancel uploading if there were any errors.
            cancelUploading({ id, error });

            trackError('upload_media', error?.message);
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
    finishUploading,
    startTranscoding,
    finishTranscoding,
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    transcodeVideo,
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
