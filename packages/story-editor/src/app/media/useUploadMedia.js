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
import { useCallback, useEffect, useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  useSnackbar,
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';
import { isAnimatedGif } from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import usePreventWindowUnload from '../../utils/usePreventWindowUnload';
import { useUploader } from '../uploader';
import { useMediaUploadQueue } from './uploadQueue';
import getResourceFromLocalFile from './utils/getResourceFromLocalFile';
import useFFmpeg from './utils/useFFmpeg';

const storageKey = LOCAL_STORAGE_PREFIX.VIDEO_OPTIMIZATION_DIALOG_DISMISSED;

/**
 * Upload media items to the app while displaying the local files in the library.
 *
 * @param {Object} props Props.
 * @param {Array<Object<*>>} props.media Media items.
 * @param {Function} props.prependMedia Action to add new media items.
 * @param {Function} props.updateMediaElement Action to update a media item.
 * @param {Function} props.deleteMediaElement Action to delete a media item.
 * @return {{uploadMedia: Function, isUploading: boolean}} Upload status, and function to upload media.
 */
function useUploadMedia({
  media,
  prependMedia,
  updateMediaElement,
  deleteMediaElement,
}) {
  const {
    actions: { validateFileForUpload },
  } = useUploader();
  const { showSnackbar, removeSnack } = useSnackbar();
  const setPreventUnload = usePreventWindowUnload();
  const {
    state: {
      isUploading,
      isTranscoding,
      pending,
      progress,
      uploaded,
      failures,
      finished,
      active,
      isNewResourceProcessing,
      isCurrentResourceProcessing,
      isNewResourceTranscoding,
      isNewResourceMuting,
      isElementTrimming,
      isCurrentResourceUploading,
      isCurrentResourceTranscoding,
      isCurrentResourceMuting,
      isCurrentResourceTrimming,
      isBatchUploading,
      canTranscodeResource,
    },
    actions: { addItem, removeItem, finishItem },
  } = useMediaUploadQueue();
  const { isTranscodingEnabled, canTranscodeFile, isFileTooLarge } =
    useFFmpeg();

  /**
   * @type {import('react').MutableRefObject<Array<Object<*>>>} mediaRef Ref for current media items.
   */
  const mediaRef = useRef();
  mediaRef.current = media;

  // Prevent closing the window/tab while upload is in progress.
  useEffect(() => {
    setPreventUnload('upload', isUploading);
  }, [isUploading, setPreventUnload]);

  useEffect(() => {
    const isDialogDismissed = Boolean(localStore.getItemByKey(storageKey));
    if (!isDialogDismissed) {
      return;
    }

    if (isTranscoding) {
      showSnackbar({
        message: __('Optimizing file…', 'web-stories'),
        dismissible: true,
        id: 'video-optimization',
      });
    } else {
      removeSnack({
        id: 'video-optimization',
      });
    }
  }, [isTranscoding, showSnackbar, removeSnack]);

  // Add *new* items to the media library and canvas.
  useEffect(() => {
    const newItems = pending.filter(
      ({ resource: { id: resourceId } }) =>
        !mediaRef.current.find(({ id }) => id === resourceId)
    );

    if (!newItems.length) {
      return;
    }

    for (const { onUploadStart, resource } of newItems) {
      if (onUploadStart) {
        onUploadStart({ resource });
      }
    }
  }, [pending]);

  // Update *existing* items in the media library and on canvas.
  useEffect(() => {
    for (const { onUploadProgress, resource } of progress) {
      const { id: resourceId } = resource;

      if (!resource) {
        continue;
      }

      updateMediaElement({
        id: resourceId,
        data: resource,
      });

      if (onUploadProgress) {
        onUploadProgress({ id: resourceId, resource: resource });
      }
    }
  }, [progress, updateMediaElement]);

  // Handle *processed* items.
  // Update resources in media library and on canvas.
  // Caters for both `resource.id` as well as `previousResourceId`,
  // since after upload to the backend, the resource's temporary uuid
  // will have been replaced with the permanent ID from the backend.
  useEffect(() => {
    for (const {
      id: itemId,
      resource,
      onUploadSuccess,
      previousResourceId,
      additionalData,
    } of uploaded) {
      const { id: resourceId } = resource;
      if (!resource) {
        continue;
      }

      updateMediaElement({ id: resourceId, data: resource });
      if (previousResourceId) {
        updateMediaElement({ id: previousResourceId, data: resource });
      }

      // onUploadSuccess typically calls postProcessingResource, which
      // will cause things like base color and BlurHash generation to run
      // twice for a given resource.
      if (onUploadSuccess) {
        onUploadSuccess({
          id: resourceId,
          resource: resource,
          batchPosition: additionalData?.batchPosition,
        });
        if (previousResourceId) {
          onUploadSuccess({
            id: previousResourceId,
            resource: resource,
            batchPosition: additionalData?.batchPosition,
          });
        }
      }

      finishItem({ id: itemId });
    }
  }, [uploaded, updateMediaElement, finishItem]);

  // Handle *finished* items.
  // At this point, uploaded resources have been updated and rendered everywhere,
  // and no further action is required.
  // It is safe to remove them from the queue now and *properly* prepend them
  // to the media library list.
  useEffect(() => {
    if (!finished.length) {
      return;
    }

    for (const { id } of finished) {
      removeItem({ id });
    }

    // Update state in 1 call instead of in the above loop.
    prependMedia({ media: finished.map(({ resource }) => resource) });
  }, [finished, removeItem, prependMedia]);

  // Handle *failed* items.
  // Remove resources from media library and canvas.
  useEffect(() => {
    for (const { id: itemId, onUploadError, error, resource } of failures) {
      const { id: resourceId } = resource;

      if (onUploadError) {
        onUploadError({ id: resourceId });
      }

      deleteMediaElement({ id: resourceId });
      removeItem({ id: itemId });

      const thumbnailSrc =
        resource && ['video', 'gif'].includes(resource.type)
          ? resource.poster
          : resource.src;

      showSnackbar({
        message:
          error?.message ||
          __(
            'File could not be uploaded. Please try a different file.',
            'web-stories'
          ),
        thumbnail: thumbnailSrc && {
          src: thumbnailSrc,
          alt: resource?.alt,
        },
        dismissible: true,
      });
    }
  }, [failures, deleteMediaElement, removeItem, showSnackbar]);

  const uploadMedia = useCallback(
    /**
     * Upload media callback.
     *
     * @param {Array<File>} files Files to upload.
     * @param {Object} args Additional arguments.
     * @param {Function} args.onUploadStart Callback for when upload starts.
     * @param {Function} args.onUploadProgress Callback for when upload progresses.
     * @param {Function} args.onUploadError Callback for when upload fails.
     * @param {Function} args.onUploadSuccess Callback for when upload succeeds.
     * @param {Object} args.additionalData Object of additionalData.
     * @param {boolean} args.muteVideo If passing a video, should it be muted.
     * @param {boolean} args.cropVideo If passing a video, should it be cropped.
     * @param {import('@googleforcreators/media').TrimData} args.trimData Trim data.
     * @param {import('@googleforcreators/media').Resource} args.resource Resource object.
     * @param {Blob} args.posterFile Blob object of poster.
     * @param {number} args.originalResourceId Original resource id.
     * @param {string} args.elementId ID of element on the canvas.
     * @return {string|null} Batch ID of the uploaded files on success, null otherwise.
     */
    async (
      files,
      {
        onUploadStart,
        onUploadProgress,
        onUploadError,
        onUploadSuccess,
        additionalData,
        muteVideo,
        cropVideo,
        trimData,
        resource,
        posterFile,
        originalResourceId,
        elementId,
      } = {}
    ) => {
      // If there are no files passed, don't try to upload.
      if (!files?.length) {
        return null;
      }

      const batchId = uuidv4();

      await Promise.all(
        files.reverse().map(async (file, index) => {
          // First, let's make sure the files we're trying to upload are actually valid.
          // We don't want to display placeholders / progress bars for items that
          // aren't supported anyway.
          const canTranscode = isTranscodingEnabled && canTranscodeFile(file);
          const isTooLarge = canTranscode && isFileTooLarge(file);
          const isHeic = file.type === 'image/heic';

          try {
            validateFileForUpload({
              file,
              canTranscodeFile: canTranscode || isHeic,
              isFileTooLarge: isTooLarge,
            });
          } catch (e) {
            showSnackbar({
              message: e.message,
              dismissible: true,
            });

            return;
          }

          // getResourceFromLocalFile() will work for most files, which allows us
          // to get the correct image/video dimensions right from the start.
          // This is important for UX as we can then display resources without
          // having to update the dimensions later on as the information becomes available.
          // Downside: it takes a tad longer for the file to initially appear.
          // Upside: file is displayed with the right dimensions from the beginning.
          if ((!resource || !posterFile) && !cropVideo) {
            const { resource: newResource, posterFile: newPosterFile } =
              await getResourceFromLocalFile(file);
            posterFile = newPosterFile;
            resource = newResource;
          }

          const isGif =
            resource.mimeType === 'image/gif' &&
            isAnimatedGif(await file.arrayBuffer());

          // Treat incoming video as a gif if wanted, used by media recording.
          if (additionalData?.isGif) {
            resource = {
              ...resource,
              type: 'gif',
              mimeType: 'image/gif',
              output: {
                mimeType: resource.mimeType,
                src: resource.src,
              },
            };
          }

          addItem({
            file,
            resource,
            onUploadStart,
            onUploadProgress,
            onUploadError,
            onUploadSuccess,
            additionalData: {
              ...additionalData,
              batchPosition: files.length - 1 - index,
              batchId,
            },
            posterFile,
            muteVideo,
            cropVideo,
            trimData,
            originalResourceId,
            elementId,
            isAnimatedGif: isGif,
          });
        })
      );

      return batchId;
    },
    [
      showSnackbar,
      validateFileForUpload,
      addItem,
      canTranscodeFile,
      isTranscodingEnabled,
      isFileTooLarge,
    ]
  );

  return {
    active,
    uploadMedia,
    isUploading,
    isTranscoding,
    isNewResourceProcessing,
    isCurrentResourceProcessing,
    isNewResourceTranscoding,
    isNewResourceMuting,
    isElementTrimming,
    isCurrentResourceUploading,
    isCurrentResourceTranscoding,
    isCurrentResourceMuting,
    isCurrentResourceTrimming,
    isBatchUploading,
    canTranscodeResource,
  };
}

export default useUploadMedia;
