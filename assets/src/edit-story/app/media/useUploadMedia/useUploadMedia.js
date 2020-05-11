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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  getResourceFromLocalFile,
  getResourceFromAttachment,
} from '../../../app/media/utils';
import createError from '../../../utils/createError';
import { fetchMedia } from '../mediaProvider';
import { isValidType, uploadFile } from '../../uploader/useUploader';

export async function uploadMedia({
  files,
  setIsUploading,
  onLocalFile,
  onUploadedFile,
  onUploadFailure,
  state: { config, media, pagingNum, mediaType, searchTerm },
  actions: {
    setMedia,
    getMedia,
    uploadMediaAPI,
    showSnackbar,
    setPreventUnload,
    resetFilters,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
  },
}) {
  const { allowedFileTypes } = config;

  let localFiles;
  try {
    setIsUploading(true);
    setPreventUnload('upload', true);

    const {
      allowedMimeTypes: {
        image: allowedImageMimeTypes,
        video: allowedVideoMimeTypes,
      },
    } = config;
    const allowedMimeTypes = [
      ...allowedImageMimeTypes,
      ...allowedVideoMimeTypes,
    ];

    files.reverse().map((file) => {
      if (!isValidType({ file, allowedMimeTypes })) {
        /* translators: %s is a list of allowed file extensions. */
        const message = sprintf(
          /* translators: %s: list of allowed file types. */
          __('Please choose only %s to upload.', 'web-stories'),
          allowedFileTypes.join(
            /* translators: delimiter used in a list */
            __(', ', 'web-stories')
          )
        );

        throw createError('ValidError', file.name, message);
      }
    });

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
      message: e.message,
    });
    return;
  }

  try {
    const uploadingFiles = await Promise.all(
      localFiles.map(async (localFile) => ({
        ...localFile,
        fileUploaded: await uploadFile({
          file: localFile.file,
          state: { config, mediaType, searchTerm, pagingNum },
          actions: {
            getMedia,
            resetFilters,
            uploadMediaAPI,
            fetchMediaStart,
            fetchMediaSuccess,
            fetchMediaError,
          },
        }),
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
    fetchMedia(
      {
        state: {
          pagingNum,
          mediaType,
          searchTerm,
        },
        actions: {
          getMedia,
          fetchMediaStart,
          fetchMediaSuccess,
          fetchMediaError,
        },
      },
      setMedia
    );
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
}
