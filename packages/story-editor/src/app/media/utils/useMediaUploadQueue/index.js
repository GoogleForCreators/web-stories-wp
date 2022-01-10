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
  useRef,
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
import { ITEM_STATUS } from './constants';

const initialState = {
  queue: [],
};

/**
 * Media upload queue implementation.
 *
 * Items added to the queue will start with PENDING state
 * and end up in FINISHED state eventually.
 * Uploading is only considered to be 100% done once
 * a finished item is removed from the queue.
 *
 * A path through the queue could look like this:
 *
 * PENDING -> TRANSCODING -> TRANSCODED -> TRIMMING -> TRIMMED -> MUTING -> MUTED -> UPLOADING -> UPLOADED -> FINISHED
 *
 * @return {{state: {Object}, actions: {Object}}} Media queue state.
 */
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

  const isMounted = useRef(false);

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
            ![
              ITEM_STATUS.TRIMMED,
              ITEM_STATUS.MUTED,
              ITEM_STATUS.TRANSCODED,
            ].includes(itemState) ||
            !resource.isPlaceholder ||
            resource.poster
          ) {
            return;
          }

          try {
            const { resource: newResource, posterFile } =
              await getResourceFromLocalFile(file);

            if (!isMounted.current) {
              return;
            }

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
          if (ITEM_STATUS.PENDING !== itemState || !resource.isPlaceholder) {
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

            if (!isMounted.current) {
              return;
            }

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

        if (!isMounted.current) {
          return;
        }

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
        // eslint-disable-next-line complexity -- TODO: Reduce complexity in future.
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
          if (ITEM_STATUS.PENDING !== itemState) {
            return;
          }

          const posterFileName = getFileName(file) + '-poster.jpeg';

          let newResource;
          let newFile = file;
          let newPosterFile = posterFile;

          if (
            resource.type === 'video' &&
            resource.isMuted !== null &&
            additionalData?.web_stories_is_muted === undefined
          ) {
            additionalData.web_stories_is_muted = resource.isMuted;
          }

          if (resource?.baseColor) {
            additionalData.meta = {
              ...additionalData.meta,
              web_stories_base_color: resource.baseColor,
            };
          }
          // Do not copy over blurhash for new trimmed videos, poster might be different.
          if (resource?.blurHash && !resource?.trimData) {
            additionalData.meta = {
              ...additionalData.meta,
              web_stories_blurhash: resource.blurHash,
            };
          }

          // Convert animated GIFs to videos if possible.
          if (
            isTranscodingEnabled &&
            resource.mimeType === 'image/gif' &&
            isAnimatedGif(await file.arrayBuffer())
          ) {
            startTranscoding({ id });

            try {
              newFile = await convertGifToVideo(file);

              if (!isMounted.current) {
                return;
              }

              finishTranscoding({ id, file: newFile });
              additionalData.web_stories_media_source = 'gif-conversion';
              additionalData.web_stories_is_muted = true;
            } catch (error) {
              // Cancel uploading if there were any errors.
              cancelUploading({ id, error });

              trackError('upload_media', error?.message);

              return;
            }

            try {
              newPosterFile = await getFirstFrameOfVideo(newFile);

              if (!isMounted.current) {
                return;
              }
            } catch (error) {
              // Do nothing here.
            }
          }

          if (isTranscodingEnabled && canTranscodeFile(file)) {
            if (trimData) {
              startTrimming({ id });
              try {
                newFile = await trimVideo(file, trimData.start, trimData.end);

                if (!isMounted.current) {
                  return;
                }

                finishTrimming({ id, file: newFile });
                additionalData.meta = {
                  ...additionalData.meta,
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

                if (!isMounted.current) {
                  return;
                }

                finishMuting({ id, file: newFile });
                additionalData.web_stories_is_muted = true;
              } catch (error) {
                // Cancel uploading if there were any errors.
                cancelUploading({ id, error });

                trackError('upload_media', error?.message);

                return;
              }
            } else {
              // Transcode/Optimize videos before upload.
              // TODO: Only transcode & optimize video if needed (criteria TBD).
              // Probably need to use FFmpeg first to get more information (dimensions, fps, etc.)

              startTranscoding({ id });

              try {
                newFile = await transcodeVideo(file);

                if (!isMounted.current) {
                  return;
                }

                finishTranscoding({ id, file: newFile });
                additionalData.web_stories_media_source = 'video-optimization';
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
            file_size: newFile?.size,
            file_type: newFile?.type,
          });

          //eslint-disable-next-line @wordpress/no-unused-vars-before-return
          const trackTiming = getTimeTracker('load_upload_media');

          try {
            // The newly uploaded file won't have a poster yet.
            // However, we'll likely still have one on file.
            // Add it back so we're never without one.
            // The final poster will be uploaded later by uploadVideoPoster().
            newResource = await uploadFile(newFile, additionalData);

            if (!isMounted.current) {
              return;
            }
          } catch (error) {
            // Cancel uploading if there were any errors.
            cancelUploading({ id, error });

            trackError('upload_media', error?.message);
          } finally {
            trackTiming();
          }

          if (newResource?.id && newPosterFile) {
            await processPoster({
              newResource,
              posterFileName,
              newPosterFile,
              resource,
              id,
            });
            return;
          }
          finishUploading({
            id,
            resource: newResource,
          });
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
    finishUploading,
  ]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useMemo(() => {
    /**
     * A list of all in-progress items.
     *
     * @type {Array} In-progress items.
     */
    const progress = state.queue.filter(
      (item) =>
        ![
          ITEM_STATUS.PENDING,
          ITEM_STATUS.CANCELLED,
          ITEM_STATUS.UPLOADED,
          ITEM_STATUS.FINISHED,
        ].includes(item.state)
    );

    /**
     * A list of all pending items that still have to be uploaded.
     *
     * @type {Array} Pending items.
     */
    const pending = state.queue.filter(
      (item) => item.state === ITEM_STATUS.PENDING
    );

    /**
     * A list of all items that just finished uploading.
     *
     * @type {Array} Uploaded items.
     */
    const uploaded = state.queue.filter(
      (item) => item.state === ITEM_STATUS.UPLOADED
    );

    /**
     * A list of all items that just finished completely.
     *
     * Nothing further is happening.
     *
     * @type {Array} Uploaded items.
     */
    const finished = state.queue.filter(
      (item) => item.state === ITEM_STATUS.FINISHED
    );

    /**
     * A list of all items that failed to upload.
     *
     * @type {Array} Failed items.
     */
    const failures = state.queue.filter(
      (item) => item.state === ITEM_STATUS.CANCELLED
    );

    /**
     * Whether any upload is currently in progress.
     *
     * This includes any transcoding/trimming/muting
     * happening before the actual file upload.
     *
     * @type {boolean} Whether we're uploading.
     */
    const isUploading = state.queue.some(
      (item) =>
        ![
          ITEM_STATUS.FINISHED,
          ITEM_STATUS.CANCELLED,
          ITEM_STATUS.PENDING,
        ].includes(item.state)
    );

    /**
     * Whether any video transcoding is currently in progress.
     *
     * @type {boolean} Whether we're transcoding.
     */
    const isTranscoding = state.queue.some(
      (item) => item.state === ITEM_STATUS.TRANSCODING
    );

    /**
     * Whether any video muting is currently in progress.
     *
     * @type {boolean} Whether we're muting.
     */
    const isMuting = state.queue.some(
      (item) => item.state === ITEM_STATUS.MUTING
    );

    /**
     * Whether any video trimming is currently in progress.
     *
     * @type {boolean} Whether we're trimming.
     */
    const isTrimming = state.queue.some(
      (item) => item.state === ITEM_STATUS.TRIMMING
    );

    /**
     * Determine whether a new resource is being processed.
     *
     * This is the case when an existing video in a story
     * is being optimized/muted/trimmed, which will cause
     * a new resource to be created and uploaded.
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is processing.
     */
    const isNewResourceProcessing = (resourceId) =>
      state.queue.some(
        (item) =>
          [
            ITEM_STATUS.TRANSCODING,
            ITEM_STATUS.TRIMMING,
            ITEM_STATUS.MUTING,
          ].includes(item.state) && item.originalResourceId === resourceId
      );

    /**
     * Determine whether the current resource is being processed.
     *
     * This is the case when uploading a new media item that first
     * needs to be transcoded/muted/trimmed.
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is processing.
     */
    const isCurrentResourceProcessing = (resourceId) =>
      state.queue.some(
        (item) =>
          [
            ITEM_STATUS.TRANSCODING,
            ITEM_STATUS.TRIMMING,
            ITEM_STATUS.MUTING,
          ].includes(item.state) && item.resource.id === resourceId
      );

    /**
     * Determine whether the current resource is being uploaded.
     *
     * This is the case when uploading a new media item after any initial
     * transcoding/muting/trimming has already happened, or when it is
     * still pending to be processed.
     *
     * Checks for both `resource.id` as well as `previousResourceId`,
     * since after upload to the backend, the resource's temporary uuid
     * will be replaced by the permanent ID from the backend.
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is uploading.
     */
    const isCurrentResourceUploading = (resourceId) =>
      state.queue.some(
        (item) =>
          [
            ITEM_STATUS.PENDING,
            ITEM_STATUS.UPLOADING,
            ITEM_STATUS.UPLOADED,
            ITEM_STATUS.FINISHED,
          ].includes(item.state) &&
          (item.resource.id === resourceId ||
            item.previousResourceId === resourceId)
      );

    /**
     * Determine whether the current resource is being transcoded.
     *
     * This is the case when uploading a new media item that first
     * needs to be transcoded.
     * This is also the case when optimizing an existing video ("A") in the story,
     * which will cause a new resource ("B") to be uploaded.
     *
     * Example:
     *
     * isNewResourceTranscoding(A) -> true
     * isCurrentResourceTranscoding(B) -> true
     * isNewResourceTranscoding(B) -> false
     * isCurrentResourceTranscoding(A) -> false
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is transcoding.
     */
    const isCurrentResourceTranscoding = (resourceId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.TRANSCODING &&
          item.resource.id === resourceId
      );

    /**
     * Determine whether the current resource is being muted.
     *
     * This is the case when uploading a new media item that first
     * needs to be muted.
     * This is also the case when muting an existing video in the story,
     * which will cause a new resource to be uploaded (the "current" one).
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is muting.
     */
    const isCurrentResourceMuting = (resourceId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.MUTING && item.resource.id === resourceId
      );

    /**
     * Determine whether the current resource is being trimmed.
     *
     * This is the case when trimming an existing video in the story,
     * which will cause a new resource to be uploaded (the "current" one).
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is trimming.
     */
    const isCurrentResourceTrimming = (resourceId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.TRIMMING && item.resource.id === resourceId
      );

    /**
     * Determine whether a resource is being transcoded.
     *
     * When optimizing an existing video in the story,
     * which will cause a new resource to be uploaded,
     * this returns the state of this new resource.
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is transcoding.
     */
    const isNewResourceTranscoding = (resourceId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.TRANSCODING &&
          item.originalResourceId === resourceId
      );

    /**
     * Determine whether a resource is being muted.
     *
     * When muting an existing video in the story,
     * which will cause a new resource to be uploaded,
     * this returns the state of this new resource.
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} Whether the resource is muting.
     */
    const isNewResourceMuting = (resourceId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.MUTING &&
          item.originalResourceId === resourceId
      );

    /**
     * Whether a given resource can be transcoded.
     *
     * Checks whether the resource is not external and
     * not already uploading.
     *
     * @param {import('@web-stories-wp/media').Resource} resource Resource object.
     * @return {boolean} Whether a given resource can be transcoded.
     */
    const canTranscodeResource = (resource) => {
      const { isExternal, id, src } = resource || {};

      return (
        !isExternal &&
        src &&
        !state.queue.some(
          (item) =>
            item.resource.id === id ||
            item.previousResourceId === id ||
            item.originalResourceId === id
        )
      );
    };

    /**
     * Is a new resource trimming.
     *
     * @param {number} resourceId Resource ID.
     * @return {boolean} if resource with id is found.
     */
    const isResourceTrimming = (resourceId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.TRIMMING &&
          item.originalResourceId === resourceId
      );

    return {
      state: {
        progress,
        pending,
        uploaded,
        failures,
        finished,
        isUploading,
        isTranscoding,
        isMuting,
        isTrimming,
        isCurrentResourceMuting,
        isCurrentResourceProcessing,
        isCurrentResourceUploading,
        isCurrentResourceTranscoding,
        isCurrentResourceTrimming,
        isNewResourceMuting,
        isNewResourceProcessing,
        isNewResourceTranscoding,
        isResourceTrimming,
        canTranscodeResource,
      },
      actions: {
        addItem: actions.addItem,
        removeItem: actions.removeItem,
        finishItem: actions.finishItem,
      },
    };
  }, [state, actions]);
}

export default useMediaUploadQueue;
