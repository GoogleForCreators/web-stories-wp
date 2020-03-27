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
import { useCallback, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useUploader } from '../../uploader';
import {
  getResourceFromLocalFile,
  getResourceFromUploadAPI,
  getResourceFromAttachment,
  getAttachmentFromResource,
} from '../../../app/media/utils';

function useUploadMedia({ media, pagingNum, mediaType, fetchMedia, setMedia }) {
  const { uploadFile } = useUploader();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMedia = useCallback(
    async (files, { onLocalFile, onUploadedFile, onUploadFailure } = {}) => {
      let localFiles;
      try {
        setIsUploading(true);

        localFiles = await Promise.all(
          files.reverse().map(async (file) => ({
            attachement: getAttachmentFromResource(
              await getResourceFromLocalFile(file)
            ),
            file,
          }))
        );

        if (onLocalFile) {
          localFiles = localFiles.map(({ attachement, file }) => {
            const resource = getResourceFromAttachment(attachement);
            return {
              attachement,
              file,
              element: onLocalFile({
                resource,
              }),
            };
          });
        }
        setMedia({
          media: [
            ...localFiles.map(({ attachement }) => attachement),
            ...media,
          ],
        });
      } catch (e) {
        setMedia({ media });

        setIsUploading(false);

        throw new Error(__('Error trying to upload a file.', 'web-stories'));
      }

      try {
        const uploadingFiles = await Promise.all(
          localFiles.map(async (localFile) => ({
            ...localFile,
            fileUploaded: await uploadFile(localFile.file),
          }))
        );

        setIsUploading(false);

        if (onUploadedFile) {
          uploadingFiles.forEach(({ element, fileUploaded }) => {
            onUploadedFile({
              resource: getResourceFromUploadAPI(fileUploaded),
              element,
            });
          });
        }

        fetchMedia({ pagingNum, mediaType }, setMedia);
      } catch (e) {
        localFiles.forEach(({ element }) => {
          if (element) {
            if (onUploadFailure) onUploadFailure({ element });
            setMedia({
              media: media.filter(
                ({ id }) => element && element.resource.id !== id
              ),
            });
          }
        });

        setIsUploading(false);

        throw new Error(__('Error uploading a file.', 'web-stories'));
      }
    },
    [setMedia, uploadFile, fetchMedia, media, pagingNum, mediaType]
  );

  return {
    uploadMedia,
    isUploading,
  };
}

export default useUploadMedia;
