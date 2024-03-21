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
  useCallback,
  useEffect,
  useMemo,
  useReduction,
  useRef,
} from '@googleforcreators/react';
import {
  getTimeTracker,
  trackError,
  trackEvent,
} from '@googleforcreators/tracking';
import {
  getExtensionFromMimeType,
  getFileBasename,
  blobToFile,
  createBlob,
  getImageDimensions,
  ResourceType,
  resourceIs,
  type ResourceId,
  type ImageResource,
} from '@googleforcreators/media';
import type { ElementId } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useUploader } from '../../uploader';
import useUploadVideoFrame from '../utils/useUploadVideoFrame';
import useFFmpeg from '../utils/useFFmpeg';
import { useConvertHeif } from '../utils/heif';
import useMediaInfo from '../utils/useMediaInfo';
import getResourceFromLocalFile from '../utils/getResourceFromLocalFile';
import { useConfig } from '../../config';
import * as reducer from './reducer';
import type {
  BatchId,
  QueueItem,
  QueueState,
  QueueItemResource,
  QueueItemId,
} from './types';
import { ItemStatus } from './types';
import { hasStatus, hasNotStatus } from './utils';

const initialState: QueueState = {
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
 * @return Media queue state.
 */
function useMediaUploadQueue() {
  const {
    allowedMimeTypes: { image: allowedImageMimeTypes = [] },
  } = useConfig();
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
  const { convertHeif } = useConvertHeif();

  const [state, actions] = useReduction(initialState, reducer);

  const { uploadVideoPoster } = useUploadVideoFrame({});

  const isMounted = useRef(false);
  const currentTranscodingItem = useRef<QueueItemId | null>(null);
  const currentPosterGenerationItem = useRef<QueueItemId | null>(null);

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
    void Promise.all(
      state.queue
        .filter(
          hasStatus(
            ItemStatus.Trimmed,
            ItemStatus.Muted,
            ItemStatus.Cropped,
            ItemStatus.Transcoded
          )
        )
        .map(async ({ id, file, resource }) => {
          if (
            !resource.isPlaceholder ||
            (resourceIs.video(resource) && resource.poster)
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
  }, [state.queue, replacePlaceholderResource]);

  // Try to get dimensions and poster for placeholder resources.
  // This way we can show something more meaningful to the user before transcoding has finished.
  // Since this uses ffmpeg, we're going to limit this to one at a time.
  useEffect(() => {
    void Promise.all(
      state.queue
        .filter(hasStatus(ItemStatus.Pending))
        .map(async ({ id, file, resource }) => {
          if (!resource.isPlaceholder) {
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
  }, [
    state.queue,
    isTranscodingEnabled,
    canTranscodeFile,
    getFirstFrameOfVideo,
    replacePlaceholderResource,
  ]);

  // Convert HEIF images to JPEG if possible.
  const convertHeifItem = useCallback(
    async ({ id, file }: QueueItem) => {
      startTranscoding({ id });

      const type = allowedImageMimeTypes.includes('image/webp')
        ? 'image/webp'
        : 'image/jpeg';

      try {
        const blob = await convertHeif(file, type);
        const ext = getExtensionFromMimeType(blob.type) || 'jpeg';
        const fileName = getFileBasename(file) + '.' + ext;
        const newFile = blobToFile(blob, fileName, type);
        finishTranscoding({ id, file: newFile });
      } catch (error) {
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
      }
    },
    [
      convertHeif,
      startTranscoding,
      finishTranscoding,
      cancelUploading,
      allowedImageMimeTypes,
    ]
  );

  // Convert animated GIFs to videos if possible.
  const convertGifItem = useCallback(
    async ({ id, file, additionalData }: QueueItem) => {
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
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startTranscoding, finishTranscoding, convertGifToVideo, cancelUploading]
  );

  const trimVideoItem = useCallback(
    async ({ id, file, additionalData, trimData }: QueueItem) => {
      if (!trimData) {
        return;
      }

      startTrimming({ id });

      currentTranscodingItem.current = id;

      try {
        const { start, end } = trimData;
        const newFile = await trimVideo(file, start, end);

        if (!isMounted.current) {
          return;
        }

        finishTrimming({ id, file: newFile, additionalData });
      } catch (error) {
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startTrimming, finishTrimming, trimVideo, cancelUploading]
  );

  const muteVideoItem = useCallback(
    async ({ id, file, additionalData }: QueueItem) => {
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
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startMuting, finishMuting, stripAudioFromVideo, cancelUploading]
  );

  const cropVideoItem = useCallback(
    async ({ id, file, additionalData }: QueueItem) => {
      if (!additionalData?.cropParams) {
        return;
      }

      startCropping({ id });

      currentTranscodingItem.current = id;

      try {
        const newFile = await cropResource(file, additionalData.cropParams);
        const posterFile = await getFirstFrameOfVideo(newFile);

        if (!isMounted.current) {
          return;
        }

        finishCropping({ id, file: newFile, posterFile, additionalData });
      } catch (error) {
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
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
    async ({ id, file, additionalData }: QueueItem) => {
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
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
      } finally {
        currentTranscodingItem.current = null;
      }
    },
    [startTranscoding, finishTranscoding, transcodeVideo, cancelUploading]
  );

  const uploadVideo = useCallback(
    async (item: QueueItem) => {
      const { id, file, resource, additionalData } = item;
      let { posterFile } = item;

      // The newly uploaded file won't have a poster yet.
      // However, we'll likely still have one on file.
      // Add it back so we're never without one.
      // The final poster will be uploaded later by uploadVideoPoster().
      let newResource: QueueItemResource = (await uploadFile(
        file,
        additionalData
      )) as QueueItemResource;

      if (!isMounted.current) {
        return;
      }

      // If we don't have a poster yet (e.g. after converting a GIF),
      // try to generate one now.
      if (resourceIs.video(resource) && !resource.poster && !posterFile) {
        try {
          posterFile = await getFirstFrameOfVideo(file);
        } catch {
          // Not interested in errors here.
        }
      }
      if (newResource.type === ResourceType.Video && posterFile) {
        try {
          const { height, width, ...posterResource } = await uploadVideoPoster(
            newResource.id,
            posterFile
          );

          if (!isMounted.current) {
            return;
          }

          newResource = {
            ...newResource,
            ...posterResource,
          };
        } catch {
          // Not interested in errors here.
        }
      }

      finishUploading({
        id,
        resource: newResource,
      });
    },
    [finishUploading, getFirstFrameOfVideo, uploadFile, uploadVideoPoster]
  );

  const uploadImage = useCallback(
    async ({ id, file, additionalData }: QueueItem) => {
      const resource: ImageResource = (await uploadFile(
        file,
        additionalData
      )) as ImageResource;

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
    async (item: QueueItem) => {
      const { id, file, resource } = item;

      startUploading({ id });

      void trackEvent('upload_media', {
        file_size: file?.size,
        file_type: file?.type,
      });

      const trackTiming = getTimeTracker('load_upload_media');

      try {
        if ([ResourceType.Video, ResourceType.Gif].includes(resource.type)) {
          await uploadVideo(item);
        } else {
          await uploadImage(item);
        }
      } catch (error) {
        if (error instanceof Error) {
          // Cancel uploading if there were any errors.
          cancelUploading({ id, error });
          void trackError('upload_media', error.message);
        }
      } finally {
        trackTiming();
      }
    },
    [startUploading, cancelUploading, uploadImage, uploadVideo]
  );

  // Upload files to server, optionally first transcoding them.
  useEffect(() => {
    state.queue.filter(hasStatus(ItemStatus.Pending)).forEach(
      /**
       * Uploads a single pending item.
       */
      (item) => {
        void (async () => {
          const {
            id,
            file,
            resource,
            isAnimatedGif,
            muteVideo,
            cropVideo,
            trimData,
          } = item;

          // Changing item state so that an item is never processed twice
          // in this effect.
          prepareItem({ id });

          const needsTranscoding =
            isAnimatedGif ||
            muteVideo ||
            cropVideo ||
            trimData ||
            file.type === 'image/heic';

          if (needsTranscoding) {
            prepareForTranscoding({ id });
            return;
          }

          const isVideo = file.type.startsWith('video/');

          if (isVideo) {
            // TODO: Consider always using getFileInfo() to have more accurate audio information.

            if (
              item.additionalData.mediaSource !== 'recording' &&
              resourceIs.video(resource) &&
              (await isConsideredOptimized(resource, file))
            ) {
              // Do not override pre-existing mediaSource if provided,
              // for example by media recording.
              if (!item.additionalData.mediaSource) {
                item.additionalData.mediaSource = 'video-optimization';
              }

              void uploadItem(item);

              return;
            }
          }

          if (!isTranscodingEnabled || !canTranscodeFile(file)) {
            void uploadItem(item);

            return;
          }

          prepareForTranscoding({ id });
        })();
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
    state.queue.filter(hasStatus(ItemStatus.PendingTranscoding)).forEach(
      /**
       * Uploads a single pending item.
       */
      (item) => {
        const { muteVideo, cropVideo, trimData, isAnimatedGif } = item;

        if (item.file.type === 'image/heic') {
          void convertHeifItem(item);
          return;
        }

        // Prevent simultaneous transcoding processes for videos.
        // See https://github.com/googleforcreators/web-stories-wp/issues/8779
        const isAlreadyTranscoding = currentTranscodingItem.current !== null;

        if (isAlreadyTranscoding) {
          return;
        }

        if (isAnimatedGif) {
          void convertGifItem(item);
          return;
        }

        if (trimData) {
          void trimVideoItem(item);
          return;
        }

        if (muteVideo) {
          void muteVideoItem(item);
          return;
        }

        if (cropVideo) {
          void cropVideoItem(item);
          return;
        }

        void optimizeVideoItem(item);
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
    convertHeifItem,
  ]);

  // Upload freshly transcoded files to server.
  useEffect(() => {
    state.queue
      .filter(
        hasStatus(
          ItemStatus.Transcoded,
          ItemStatus.Muted,
          ItemStatus.Trimmed,
          ItemStatus.Cropped
        )
      )
      .forEach((item) => void uploadItem(item));
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
     */
    const progress = state.queue.filter(
      hasNotStatus(
        ItemStatus.Pending,
        ItemStatus.Cancelled,
        ItemStatus.Uploaded,
        ItemStatus.Finished
      )
    );

    /**
     * A list of all pending items that still have to be uploaded.
     */
    const pending = state.queue.filter(hasStatus(ItemStatus.Pending));

    /**
     * A list of all items that just finished uploading.
     */
    const uploaded = state.queue.filter(hasStatus(ItemStatus.Uploaded));

    /**
     * A list of all items that just finished completely.
     *
     * Nothing further is happening.
     */
    const finished = state.queue.filter(hasStatus(ItemStatus.Finished));

    /**
     * A list of all items that are still in the queue and not cancelled.
     */
    const active = state.queue.filter(hasNotStatus(ItemStatus.Cancelled));

    /**
     * A list of all items that failed to upload.
     */
    const failures = state.queue.filter(hasStatus(ItemStatus.Cancelled));

    /**
     * Whether any upload is currently in progress.
     *
     * This includes any transcoding/trimming/muting
     * happening before the actual file upload.
     */
    const isUploading = state.queue.some(
      hasNotStatus(
        ItemStatus.Finished,
        ItemStatus.Cancelled,
        ItemStatus.Pending
      )
    );

    /**
     * Whether any video transcoding is currently in progress.
     */
    const isTranscoding = state.queue.some(hasStatus(ItemStatus.Transcoding));

    /**
     * Whether any video muting is currently in progress.
     */
    const isMuting = state.queue.some(hasStatus(ItemStatus.Muting));

    /**
     * Whether any video cropping is currently in progress.
     */
    const isCropping = state.queue.some(hasStatus(ItemStatus.Cropping));

    /**
     * Whether any video trimming is currently in progress.
     */
    const isTrimming = state.queue.some(hasStatus(ItemStatus.Trimming));

    /**
     * Determine whether a new resource is being processed.
     *
     * This is the case when an existing video in a story
     * is being optimized/muted/trimmed, which will cause
     * a new resource to be created and uploaded.
     */
    const isNewResourceProcessing = (resourceId: ResourceId) =>
      state.queue
        .filter(
          hasStatus(
            ItemStatus.Transcoding,
            ItemStatus.Trimming,
            ItemStatus.Muting,
            ItemStatus.Cropping
          )
        )
        .some((item) => item.originalResourceId === resourceId);

    /**
     * Determine whether the current resource is being processed.
     *
     * This is the case when uploading a new media item that first
     * needs to be transcoded/muted/trimmed.
     */
    const isCurrentResourceProcessing = (resourceId: ResourceId) =>
      state.queue
        .filter(
          hasStatus(
            ItemStatus.PendingTranscoding,
            ItemStatus.Transcoding,
            ItemStatus.Trimming,
            ItemStatus.Muting,
            ItemStatus.Cropping
          )
        )
        .some((item) => item.resource.id === resourceId);

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
     */
    const isCurrentResourceUploading = (resourceId: ResourceId) =>
      state.queue
        .filter(
          hasStatus(
            ItemStatus.Pending,
            ItemStatus.Preparing,
            ItemStatus.Uploading,
            ItemStatus.Uploaded,
            ItemStatus.Finished
          )
        )
        .some(
          (item) =>
            item.resource.id === resourceId ||
            item.previousResourceId === resourceId
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
     */
    const isCurrentResourceTranscoding = (resourceId: ResourceId) =>
      state.queue
        .filter(hasStatus(ItemStatus.Transcoding))
        .some((item) => item.resource.id === resourceId);

    /**
     * Determine whether the current resource is being muted.
     *
     * This is the case when uploading a new media item that first
     * needs to be muted.
     * This is also the case when muting an existing video in the story,
     * which will cause a new resource to be uploaded (the "current" one).
     */
    const isCurrentResourceMuting = (resourceId: ResourceId) =>
      state.queue
        .filter(hasStatus(ItemStatus.Muting))
        .some((item) => item.resource.id === resourceId);

    /**
     * Determine whether a batch of resources is being uploaded.
     *
     * batchId is available when uploading a new array of files
     *
     * @param batchId Resource batchId.
     * @return Whether the batch of resources is uploading.
     */
    const isBatchUploading = (batchId: BatchId) => {
      return state.queue.some(
        (item) => item.additionalData?.batchId === batchId
      );
    };

    /**
     * Determine whether the current resource is being trimmed.
     *
     * This is the case when trimming an existing video in the story,
     * which will cause a new resource to be uploaded (the "current" one).
     */
    const isCurrentResourceTrimming = (resourceId: ResourceId) =>
      state.queue
        .filter(hasStatus(ItemStatus.Trimming))
        .some((item) => item.resource.id === resourceId);

    /**
     * Determine whether a resource is being transcoded.
     *
     * When optimizing an existing video in the story,
     * which will cause a new resource to be uploaded,
     * this returns the state of this new resource.
     */
    const isNewResourceTranscoding = (resourceId: ResourceId) =>
      state.queue
        .filter(hasStatus(ItemStatus.Transcoding))
        .some((item) => item.originalResourceId === resourceId);

    /**
     * Determine whether a resource is being muted.
     *
     * When muting an existing video in the story,
     * which will cause a new resource to be uploaded,
     * this returns the state of this new resource.
     */
    const isNewResourceMuting = (resourceId: ResourceId) =>
      state.queue
        .filter(hasStatus(ItemStatus.Muting))
        .some((item) => item.originalResourceId === resourceId);

    /**
     * Whether a given resource can be transcoded.
     *
     * Checks whether the resource is not external and
     * not already uploading.
     */
    const canTranscodeResource = (resource?: QueueItemResource) => {
      if (!resource) {
        return false;
      }

      const { isExternal, id, src = '' } = resource;

      return (
        isExternal === false &&
        src !== '' &&
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
     * @param elementId Element ID.
     * @return if element with id is found.
     */
    const isElementTrimming = (elementId: ElementId) =>
      state.queue
        .filter(hasStatus(ItemStatus.Trimming))
        .some((item) => item.elementId === elementId);

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
        isBatchUploading,
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
