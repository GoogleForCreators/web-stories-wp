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
import { useCallback, useEffect, useRef } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import usePreventWindowUnload from '../../utils/usePreventWindowUnload';
import { useUploader } from '../uploader';
import { useSnackbar } from '../snackbar';
import localStore, { LOCAL_STORAGE_PREFIX } from '../../utils/localStore';
import { useMediaUploadQueue } from './utils';
import getResourceFromLocalFile from './utils/getResourceFromLocalFile';
import useTranscodeVideo from './utils/useTranscodeVideo';

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
  const { showSnackbar } = useSnackbar();
  const setPreventUnload = usePreventWindowUnload();
  const {
    state: {
      isUploading,
      isTranscoding,
      pending,
      progress,
      processed,
      failures,
    },
    actions: { addItem, removeItem },
  } = useMediaUploadQueue();
  const {
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    isFileTooLarge,
  } = useTranscodeVideo();

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

    if (isTranscoding && isDialogDismissed) {
      showSnackbar({
        message: __('Video optimization in progress.', 'web-stories'),
        dismissable: true,
      });
    }
  }, [isTranscoding, showSnackbar]);

  // Add *new* items to the media library and canvas.
  useEffect(() => {
    const newItems = pending.filter(
      ({ id }) => !mediaRef.current.find(({ id: _id }) => id === _id)
    );

    if (!newItems.length) {
      return;
    }

    for (const { onUploadStart, resource } of newItems) {
      if (onUploadStart) {
        onUploadStart({ resource });
      }
    }

    const resourcesToAdd = newItems.map(({ resource }) => resource);

    prependMedia({
      media: resourcesToAdd,
    });
  }, [pending, prependMedia]);

  // Update *existing* items in the media library and on canvas.
  useEffect(() => {
    for (const { id, onUploadProgress, resource } of progress) {
      if (!resource) {
        continue;
      }

      updateMediaElement({
        id,
        data: resource,
      });

      if (onUploadProgress) {
        onUploadProgress({ id, resource: resource });
      }
    }
  }, [progress, updateMediaElement]);

  // Handle *processed* items.
  // Update resources in media library and on canvas.
  useEffect(() => {
    for (const { id, resource, onUploadSuccess } of processed) {
      if (!resource) {
        continue;
      }

      updateMediaElement({ id, data: resource });

      if (onUploadSuccess) {
        onUploadSuccess({ id, resource: resource });
      }

      removeItem({ id });
    }
  }, [processed, updateMediaElement, removeItem]);

  // Handle *failed* items.
  // Remove resources from media library and canvas.
  useEffect(() => {
    for (const { id, onUploadError, error } of failures) {
      if (onUploadError) {
        onUploadError({ id });
      }
      deleteMediaElement({ id });
      removeItem({ id });

      showSnackbar({
        message:
          error?.message ||
          __(
            'File could not be uploaded. Please try a different file.',
            'web-stories'
          ),
        dismissable: true,
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
     * @return {void}
     */
    async (
      files,
      { onUploadStart, onUploadProgress, onUploadError, onUploadSuccess } = {}
    ) => {
      // If there are no files passed, don't try to upload.
      if (!files?.length) {
        return;
      }

      await Promise.all(
        files.reverse().map(async (file) => {
          // First, let's make sure the files we're trying to upload are actually valid.
          // We don't want to display placeholders / progress bars for items that
          // aren't supported anyway.

          const canTranscode =
            isFeatureEnabled && isTranscodingEnabled && canTranscodeFile(file);
          const isTooLarge = canTranscode && isFileTooLarge(file);

          try {
            validateFileForUpload(file, canTranscode, isTooLarge);
          } catch (e) {
            showSnackbar({
              message: e.message,
              dismissable: true,
            });

            return;
          }

          // getResourceFromLocalFile() will work for most files, which allows us
          // to get the correct image/video dimensions right from the start.
          // This is important for UX as we can then display resources without
          // having to update the dimensions later on as the information becomes available.
          // Downside: it takes a tad longer for the file to initially appear.
          // Upside: file is displayed with the right dimensions from the beginning.
          const resource = await getResourceFromLocalFile(file);
          addItem({
            file,
            resource,
            onUploadStart,
            onUploadProgress,
            onUploadError,
            onUploadSuccess,
          });
        })
      );
    },
    [
      showSnackbar,
      validateFileForUpload,
      addItem,
      canTranscodeFile,
      isFeatureEnabled,
      isTranscodingEnabled,
      isFileTooLarge,
    ]
  );

  return {
    uploadMedia,
    isUploading,
    isTranscoding,
  };
}

export default useUploadMedia;
