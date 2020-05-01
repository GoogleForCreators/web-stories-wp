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
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useUploader } from '../../uploader';
import { useSnackbar } from '../../snackbar';
import { useConfig } from '../../config';
import {
  getResourceFromLocalFile,
  getResourceFromAttachment,
} from '../../../app/media/utils';
import usePreventWindowUnload from '../../../utils/usePreventWindowUnload';

function useUploadMedia({ media, pagingNum, mediaType, fetchMedia, setMedia }) {
  const { uploadFile } = useUploader();
  const { showSnackbar } = useSnackbar();
  const { allowedFileTypes } = useConfig();
  const [isUploading, setIsUploading] = useState(false);
  const setPreventUnload = usePreventWindowUnload();

  const uploadMedia = useCallback(
    async (files, { onLocalFile, onUploadedFile, onUploadFailure } = {}) => {
      let localFiles;
      try {
        setIsUploading(true);
        setPreventUnload('upload', true);

        localFiles = await Promise.all(
          files.reverse().map(async (file) => ({
            localResource: await getResourceFromLocalFile(file),
            file,
          }))
        );

        if (onLocalFile) {
          localFiles = localFiles.map(({ localResource, file }) => {
            // @todo: Remove `element` here when the `updateResource` API
            // lands.
            const element = onLocalFile({ resource: localResource });
            return { localResource, file, element };
          });
        }
        setMedia({
          media: [
            ...localFiles.map(({ localResource }) => localResource),
            ...media,
          ],
        });
      } catch (e) {
        setMedia({ media });

        setIsUploading(false);
        showSnackbar({
          message: createInterpolateElement(
            sprintf(
              /* translators: %s: list of allowed file types. */
              __('Please choose only <b>%s</b> to upload.', 'web-stories'),
              allowedFileTypes.join(
                /* translators: delimiter used in a list */
                __(', ', 'web-stories')
              )
            ),
            {
              b: <b />,
            }
          ),
        });
        return;
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
              resource: getResourceFromAttachment(fileUploaded),
              element,
            });
          });
        }
        fetchMedia({ pagingNum, mediaType }, setMedia);
      } catch (e) {
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
    [
      setMedia,
      media,
      showSnackbar,
      allowedFileTypes,
      fetchMedia,
      pagingNum,
      mediaType,
      uploadFile,
      setPreventUnload,
    ]
  );

  return {
    uploadMedia,
    isUploading,
  };
}

export default useUploadMedia;
