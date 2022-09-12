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
} from '@googleforcreators/react';
import {
  trackError,
  trackEvent,
  getTimeTracker,
} from '@googleforcreators/tracking';
import {
  createBlob,
  getFileBasename,
  getImageDimensions,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useUploader } from '../../../uploader';
import { noop } from '../../../../utils/noop';
import useUploadVideoFrame from '../useUploadVideoFrame';
import useFFmpeg from '../useFFmpeg';
import useMediaInfo from '../useMediaInfo';
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
 * PENDING -> PREPARING -> PENDING TRANSCODING -> TRANSCODING -> TRANSCODED -> TRIMMING -> TRIMMED -> MUTING -> MUTED -> CROPPING -> CROPPED -> UPLOADING -> UPLOADED -> FINISHED
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
    cropVideo: cropResource,
  } = useFFmpeg();
  const { isConsideredOptimized } = useMediaInfo();

  const [state, actions] = useReduction(initialState, reducer);
  const { uploadVideoPoster } = useUploadVideoFrame({
    updateMediaElement: noop,
  });

  const isMounted = useRef(false);
  const currentTranscodingItem = useRef(null);
  const currentPosterGenerationItem = useRef(null);

  const {
    prepareItem,
    prepareForTranscoding,
    startUploading,
    finishUploading,
    cancelUploading,
    startTranscoding,
    startMuting,
    startCropping,
    startTrimming,
    finishTranscoding,
    finishMuting,
    finishCropping,
    finishTrimming,
    replacePlaceholderResource,
  } = actions;

  // Try to update placeholder resources for freshly transcoded file if still missing.
  useEffect(() => {
    (async () => {
      await Promise.all(
        state.queue.map(async (item) => {
          const { id, file, state: itemState, resource } = item;
          if (
            ![
              ITEM_STATUS.TRIMMED,
              ITEM_STATUS.MUTED,
              ITEM_STATUS.CROPPED,
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
    })();
  }, [state.queue, replacePlaceholderResource]);

  // Try to get dimensions and poster for placeholder resources.
  // This way we can show something more meaningful to the user before transcoding has finished.
  // Since this uses ffmpeg, we're going to limit this to one at a time.
  useEffect(() => {
    (async () => {
      await Promise.all(
        state.queue.map(async (item) => {
          const { id, file, state: itemState, resource } = item;
          if (ITEM_STATUS.PENDING !== itemState || !resource.isPlaceholder) {
            return;
          }

          if (!isTranscodingEnabled || !canTranscodeFile(file)) {
            return;
          }

          const isAlreadyGeneratingPoster =
            currentPosterGenerationItem.current !== null;

          // Prevent simultaneous ffmpeg poster generation processes.
          // See https://github.com/googleforcreators/web-stories-wp/issues/8779
          if (isAlreadyGeneratingPoster) {
            return;
          }

          currentPosterGenerationItem.current = id;

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
          } finally {
            currentPosterGenerationItem.current = null;
          }
        })
      );
    })();
  }, [
    state.queue,
    isTranscodingEnabled,
    canTranscodeFile,
    getFirstFrameOfVideo,
    replacePlaceholderResource,
  ]);

  // Convert animated GIFs to videos if possible.
  const convertGifItem = useCallback(
    async (item) => {
      const { id, file, additionalData = {} } = item;

      startTranscoding({ id });

      currentTranscodingItem.current = id;

      try {
        const newFile = await convertGifToVideo(file);

        if (!isMounted.current) {
          return;
        }

        additionalData.mediaSource = 'gif-conversion';
        additionalData.isMuted = true;
        finishTranscoding({ id, file: newFile, additionalData });
      } catch (error) {
        // Cancel uploading if there were any errors.
        cancelUploading({ id, error });

        trackError('upload_media', error?.message);
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startTranscoding, finishTranscoding, convertGifToVideo, cancelUploading]
  );

  const trimVideoItem = useCallback(
    async (item) => {
      const { id, file, additionalData = {}, trimData } = item;

      startTrimming({ id });

      currentTranscodingItem.current = id;

      try {
        const newFile = await trimVideo(file, trimData.start, trimData.end);

        if (!isMounted.current) {
          return;
        }

        additionalData.meta = {
          ...additionalData.meta,
          trimData,
        };
        finishTrimming({ id, file: newFile, additionalData });
      } catch (error) {
        // Cancel uploading if there were any errors.
        cancelUploading({ id, error });

        trackError('upload_media', error?.message);
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startTrimming, finishTrimming, trimVideo, cancelUploading]
  );

  const muteVideoItem = useCallback(
    async (item) => {
      const { id, file, additionalData = {} } = item;

      startMuting({ id });

      currentTranscodingItem.current = id;

      try {
        const newFile = await stripAudioFromVideo(file);

        if (!isMounted.current) {
          return;
        }

        additionalData.isMuted = true;
        finishMuting({ id, file: newFile, additionalData });
      } catch (error) {
        // Cancel uploading if there were any errors.
        cancelUploading({ id, error });

        trackError('upload_media', error?.message);
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startMuting, finishMuting, stripAudioFromVideo, cancelUploading]
  );

  const cropVideoItem = useCallback(
    async (item) => {
      const { id, file, additionalData } = item;

      startCropping({ id });

      currentTranscodingItem.current = id;

      try {
        const newFile = await cropResource(file, additionalData.cropParams);
        const posterFile = await getFirstFrameOfVideo(newFile);

        if (!isMounted.current) {
          return;
        }

        additionalData.isCropped = true;
        finishCropping({ id, file: newFile, posterFile, additionalData });
      } catch (error) {
        // Cancel uploading if there were any errors.
        cancelUploading({ id, error });

        trackError('upload_media', error?.message);
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [
      startCropping,
      finishCropping,
      cropResource,
      cancelUploading,
      getFirstFrameOfVideo,
    ]
  );

  const optimizeVideoItem = useCallback(
    async (item) => {
      const { id, file, additionalData = {} } = item;

      startTranscoding({ id });

      currentTranscodingItem.current = id;

      try {
        const newFile = await transcodeVideo(file);

        if (!isMounted.current) {
          return;
        }

        // Do not override pre-existing mediaSource if provided,
        // for example by media recording.
        if (!additionalData.mediaSource) {
          additionalData.mediaSource = 'video-optimization';
        }

        finishTranscoding({ id, file: newFile, additionalData });
      } catch (error) {
        // Cancel uploading if there were any errors.
        cancelUploading({ id, error });

        trackError('upload_media', error?.message);
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startTranscoding, finishTranscoding, transcodeVideo, cancelUploading]
  );

  const uploadVideo = useCallback(
    async (item) => {
      const { id, file, resource, additionalData = {} } = item;
      let { posterFile } = item;

      // The newly uploaded file won't have a poster yet.
      // However, we'll likely still have one on file.
      // Add it back so we're never without one.
      // The final poster will be uploaded later by uploadVideoPoster().
      let newResource = await uploadFile(file, additionalData);

      if (!isMounted.current) {
        return;
      }

      // If we don't have a poster yet (e.g. after converting a GIF),
      // try to generate one now.
      if (!resource.poster && !posterFile) {
        try {
          posterFile = await getFirstFrameOfVideo(file);
        } catch {
          // Not interested in errors here.
        }
      }

      try {
        const posterFileName = getFileBasename(posterFile);
        const { poster, posterId } = await uploadVideoPoster(
          newResource.id,
          posterFileName,
          posterFile
        );

        if (!isMounted.current) {
          return;
        }

        newResource = {
          ...newResource,
          poster: poster || newResource.poster || resource.poster,
          posterId,
        };
      } catch {
        // Not interested in errors here.
      }

      finishUploading({
        id,
        resource: newResource,
      });
    },
    [finishUploading, getFirstFrameOfVideo, uploadFile, uploadVideoPoster]
  );

  const uploadImage = useCallback(
    async (item) => {
      const { id, file, additionalData = {} } = item;
      const resource = await uploadFile(file, additionalData);

      if (!isMounted.current) {
        return;
      }

      finishUploading({
        id,
        resource,
      });
    },
    [finishUploading, uploadFile]
  );

  const uploadItem = useCallback(
    async (item) => {
      const { id, file, resource } = item;

      startUploading({ id });

      trackEvent('upload_media', {
        file_size: file?.size,
        file_type: file?.type,
      });

      const trackTiming = getTimeTracker('load_upload_media');

      try {
        if (['video', 'gif'].includes(resource.type)) {
          await uploadVideo(item);
        } else {
          await uploadImage(item);
        }
      } catch (error) {
        // Cancel uploading if there were any errors.
        cancelUploading({ id, error });

        trackError('upload_media', error?.message);
      } finally {
        trackTiming();
      }
    },
    [startUploading, cancelUploading, uploadImage, uploadVideo]
  );

  // Upload files to server, optionally first transcoding them.
  useEffect(() => {
    state.queue.forEach(
      /**
       * Uploads a single pending item.
       *
       * @param {Object} item Queue item.
       * @param {File} item.file File object.
       * @param {Object} item.additionalData Additional Data object.
       */
      async (item) => {
        const {
          id,
          file,
          resource,
          isAnimatedGif,
          state: itemState,
          muteVideo,
          cropVideo,
          trimData,
        } = item;
        if (ITEM_STATUS.PENDING !== itemState) {
          return;
        }

        // Changing item state so that an item is never processed twice
        // in this effect.
        prepareItem({ id });

        const needsTranscoding =
          isAnimatedGif || muteVideo || cropVideo || trimData;

        if (needsTranscoding) {
          prepareForTranscoding({ id });
          return;
        }

        const isVideo = file.type.startsWith('video/');

        if (isVideo) {
          // TODO: Consider always using getFileInfo() to have more accurate audio information.

          if (
            item.additionalData.mediaSource !== 'recording' &&
            (await isConsideredOptimized(resource, file))
          ) {
            // Do not override pre-existing mediaSource if provided,
            // for example by media recording.
            if (!item.additionalData.mediaSource) {
              item.additionalData.mediaSource = 'video-optimization';
            }

            uploadItem(item);

            return;
          }
        }

        if (!isTranscodingEnabled || !canTranscodeFile(file)) {
          uploadItem(item);

          return;
        }

        prepareForTranscoding({ id });
      }
    );
  }, [
    state.queue,
    prepareItem,
    prepareForTranscoding,
    isConsideredOptimized,
    uploadItem,
    isTranscodingEnabled,
    canTranscodeFile,
  ]);

  // Transcode items sequentially.
  useEffect(() => {
    state.queue.forEach(
      /**
       * Uploads a single pending item.
       *
       * @param {Object} item Queue item.
       * @param {File} item.file File object.
       * @param {Object} item.additionalData Additional Data object.
       */
      (item) => {
        const {
          muteVideo,
          cropVideo,
          trimData,
          isAnimatedGif,
          state: itemState,
        } = item;
        if (ITEM_STATUS.PENDING_TRANSCODING !== itemState) {
          return;
        }

        const isAlreadyTranscoding = currentTranscodingItem.current !== null;

        // Prevent simultaneous transcoding processes.
        // See https://github.com/googleforcreators/web-stories-wp/issues/8779
        if (isAlreadyTranscoding) {
          return;
        }

        if (isAnimatedGif) {
          convertGifItem(item);
          return;
        }

        if (trimData) {
          trimVideoItem(item);
          return;
        }

        if (muteVideo) {
          muteVideoItem(item);
          return;
        }

        if (cropVideo) {
          cropVideoItem(item);
          return;
        }

        optimizeVideoItem(item);
      }
    );
  }, [
    state.queue,
    prepareItem,
    optimizeVideoItem,
    convertGifItem,
    trimVideoItem,
    muteVideoItem,
    cropVideoItem,
  ]);

  // Upload freshly transcoded files to server.
  useEffect(() => {
    state.queue.forEach((item) => {
      const { state: itemState } = item;
      if (
        ![
          ITEM_STATUS.TRANSCODED,
          ITEM_STATUS.MUTED,
          ITEM_STATUS.TRIMMED,
          ITEM_STATUS.CROPPED,
        ].includes(itemState)
      ) {
        return;
      }

      uploadItem(item);
    });
  }, [state.queue, uploadItem]);

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
     * A list of all items that are still in the queue and not cancelled.
     *
     * @type {Array} Failed items.
     */
    const active = state.queue.filter(
      (item) => item.state !== ITEM_STATUS.CANCELLED
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
     * Whether any video cropping is currently in progress.
     *
     * @type {boolean} Whether we're muting.
     */
    const isCropping = state.queue.some(
      (item) => item.state === ITEM_STATUS.CROPPING
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
            ITEM_STATUS.CROPPING,
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
            ITEM_STATUS.PENDING_TRANSCODING,
            ITEM_STATUS.TRANSCODING,
            ITEM_STATUS.TRIMMING,
            ITEM_STATUS.MUTING,
            ITEM_STATUS.CROPPING,
          ].includes(item.state) && item.resource.id === resourceId
      );

    /**
     * Determine whether the current resource is being uploaded.
     *
     * This is the case when uploading a new media item after any initial
     * transcoding/muting/trimming has already happened, or when it is
     * still pending to be processed.
     *
     * Checks for both `resource.id` and `previousResourceId`,
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
            ITEM_STATUS.PREPARING,
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
     * @param {import('@googleforcreators/media').Resource} resource Resource object.
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
     * Is a element trimming.
     *
     * @param {string} elementId Element ID.
     * @return {boolean} if element with id is found.
     */
    const isElementTrimming = (elementId) =>
      state.queue.some(
        (item) =>
          item.state === ITEM_STATUS.TRIMMING && item.elementId === elementId
      );

    return {
      state: {
        progress,
        pending,
        uploaded,
        failures,
        finished,
        active,
        isUploading,
        isTranscoding,
        isMuting,
        isCropping,
        isTrimming,
        isCurrentResourceMuting,
        isCurrentResourceProcessing,
        isCurrentResourceUploading,
        isCurrentResourceTranscoding,
        isCurrentResourceTrimming,
        isNewResourceMuting,
        isNewResourceProcessing,
        isNewResourceTranscoding,
        isElementTrimming,
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
