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
import { useCallback, useEffect, useRef, useState } from 'react';
import { trackError } from '@web-stories-wp/tracking';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import usePreventWindowUnload from '../../utils/usePreventWindowUnload';
import { useUploader } from '../uploader';
import { useSnackbar } from '../snackbar';
import { getResourceFromLocalFile, getResourceFromAttachment } from './utils';

/**
 * Upload media items to the app while displaying the local files in the library.
 *
 * @todo Revisit local resource handling.
 * See https://github.com/google/web-stories-wp/issues/6053 and https://github.com/google/web-stories-wp/issues/6088
 *
 * @param {Object} props Props.
 * @param {Array<Object<*>>} props.media Media items.
 * @param {Function} props.setMedia Actions to set media items.
 * @return {{uploadMedia: Function, isUploading: boolean}} Upload status, and function to upload media.
 */
function useUploadMedia({ media, setMedia }) {
  const { uploadFile } = useUploader();
  const { showSnackbar } = useSnackbar();
  const [isUploading, setIsUploading] = useState(false);
  const setPreventUnload = usePreventWindowUnload();

  /**
   * @type {import('react').MutableRefObject<Array<Object<*>>>} mediaRef Ref for current media items.
   */
  const mediaRef = useRef();
  mediaRef.current = media;

  // Prevent closing the window/tab while upload is in progress.
  useEffect(() => {
    setPreventUnload('upload', isUploading);
  }, [isUploading, setPreventUnload]);

  const uploadMedia = useCallback(
    /**
     *
     * @param {Array<File>} files Files to upload.
     * @param {Object} args Additional arguments.
     * @param {Function} args.onLocalFile Callback to act on local files.
     * @param {Function} args.onUploadedFile Callback for successful uploads.
     * @param {Function} args.onUploadFailure Callback for uploadfailures.
     * @return {Promise<void>}
     */
    async (files, { onLocalFile, onUploadedFile, onUploadFailure } = {}) => {
      const mediaItems = mediaRef.current;

      // If there are no files passed, don't try to upload.
      if (!files?.length) {
        return;
      }

      /**
       * @type {Array<Object<{localResource:Object<*>, file:File, fileUploaded?:Object<*>}>>} localFiles.
       */
      let localFiles;
      let updatedMedia;

      // First, prepare all files for uploading by getting a resource object
      // and adding the files to the media library.
      try {
        setIsUploading(true);

        localFiles = await Promise.all(
          files.reverse().map(async (file) => ({
            localResource: await getResourceFromLocalFile(file),
            file,
          }))
        );

        // localResource can be null for files with invalid or missing type.
        localFiles = localFiles.filter((f) => f.localResource);

        if (onLocalFile) {
          localFiles = localFiles.map(({ localResource, file }) => {
            // @todo: Remove `element` here when the `updateResource` API
            // lands.
            const element = onLocalFile({ resource: localResource });
            return { localResource, file, element };
          });
        }

        // If there are any valid local files remaining, add their resources to the library.
        if (localFiles.length) {
          updatedMedia = [
            ...localFiles.map(({ localResource }) => localResource),
            ...mediaItems,
          ];
          setMedia({ media: updatedMedia });
        }
      } catch (e) {
        // Catching errors from getResourceFromLocalFile() above.

        trackError('upload media', e.message);

        setIsUploading(false);

        showSnackbar({
          message:
            e.message ||
            __(
              'File could not be uploaded. Please try a different file.',
              'web-stories'
            ),
        });

        return;
      }

      if (localFiles.length !== files.length) {
        showSnackbar({
          message: __(
            'One or more files could not be uploaded. Please try a different file.',
            'web-stories'
          ),
        });
      }

      if (localFiles.length === 0) {
        return;
      }

      try {
        // Upload all the files one by one and get the new resource
        // from the uploaded attachment returned by the server.
        const uploadedFiles = await Promise.all(
          localFiles.map(async (localFile) => ({
            ...localFile,
            fileUploaded: getResourceFromAttachment(
              await uploadFile(localFile.file)
            ),
          }))
        );

        setIsUploading(false);

        // So callers can replace local resource with newly uploaded resource (e.g. on the canvas).
        if (onUploadedFile) {
          uploadedFiles.forEach(({ element, fileUploaded }) => {
            onUploadedFile({
              resource: fileUploaded,
              element,
            });
          });
        }

        // Add newly uploaded files to the media library.
        const uploadedFilesMap = new Map(
          uploadedFiles.map(({ localResource, fileUploaded }) => [
            localResource,
            fileUploaded,
          ])
        );
        setMedia({
          media: updatedMedia.map((resource) => {
            return uploadedFilesMap.get(resource) ?? resource;
          }),
        });
      } catch (e) {
        trackError('upload media', e.message);

        showSnackbar({
          message: e.message,
        });

        // Remove local files from library again upon failure
        // and inform callers so they can remove the file again (e.g. on the canvas).
        localFiles.forEach(({ localResource, element }) => {
          if (onUploadFailure) {
            onUploadFailure({ element });
          }
          setMedia({
            media: mediaItems.filter((resource) => resource !== localResource),
          });
        });

        setIsUploading(false);
      }
    },
    [setMedia, showSnackbar, uploadFile]
  );

  return {
    uploadMedia,
    isUploading,
  };
}

export default useUploadMedia;
