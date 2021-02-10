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
import { useCallback, useRef, useState } from 'react';
import { trackError } from '@web-stories-wp/tracking';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useUploader } from '../../uploader';
import { useSnackbar } from '../../snackbar';
import {
  getResourceFromLocalFile,
  getResourceFromAttachment,
} from '../../../app/media/utils';
import usePreventWindowUnload from '../../../utils/usePreventWindowUnload';

function useUploadMedia({ media, setMedia }) {
  const { uploadFile } = useUploader();
  const { showSnackbar } = useSnackbar();
  const [isUploading, setIsUploading] = useState(false);
  const setPreventUnload = usePreventWindowUnload();

  const mediaRef = useRef();
  mediaRef.current = media;

  const uploadMedia = useCallback(
    async (files, { onLocalFile, onUploadedFile, onUploadFailure } = {}) => {
      // eslint-disable-next-line no-shadow
      const media = mediaRef.current;

      // If there are no files passed, don't try to upload.
      if (!files || files.length === 0) {
        return;
      }

      let localFiles;
      let updatedMedia;
      try {
        setIsUploading(true);
        setPreventUnload('upload', true);

        localFiles = await Promise.all(
          files.reverse().map(async (file) => ({
            localResource: await getResourceFromLocalFile(file),
            file,
          }))
        );
        localFiles = localFiles.filter((f) => f.localResource != null);

        if (onLocalFile) {
          localFiles = localFiles.map(({ localResource, file }) => {
            // @todo: Remove `element` here when the `updateResource` API
            // lands.
            const element = onLocalFile({ resource: localResource });
            return { localResource, file, element };
          });
        }
        updatedMedia = [
          ...localFiles.map(({ localResource }) => localResource),
          ...media,
        ];
        setMedia({ media: updatedMedia });
      } catch (e) {
        trackError('upload media', e.message);
        setMedia({ media });
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

      try {
        const uploadedFiles = await Promise.all(
          localFiles.map(async (localFile) => ({
            ...localFile,
            fileUploaded: getResourceFromAttachment(
              await uploadFile(localFile.file)
            ),
          }))
        );

        setIsUploading(false);

        if (onUploadedFile) {
          uploadedFiles.forEach(({ element, fileUploaded }) => {
            onUploadedFile({
              resource: fileUploaded,
              element,
            });
          });
        }

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
        localFiles.forEach(({ localResource, element }) => {
          if (onUploadFailure) {
            onUploadFailure({ element });
          }
          setMedia({
            media: media.filter((resource) => resource !== localResource),
          });
        });

        setIsUploading(false);
      } finally {
        setPreventUnload('upload', false);
      }
    },
    [setMedia, showSnackbar, uploadFile, setPreventUnload]
  );

  return {
    uploadMedia,
    isUploading,
  };
}

export default useUploadMedia;
