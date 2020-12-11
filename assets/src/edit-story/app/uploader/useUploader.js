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
import { useCallback, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useConfig } from '../config';
import createError from '../../utils/createError';

function useUploader() {
  const {
    actions: { uploadMedia },
  } = useAPI();
  const {
    storyId,
    maxUpload,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    allowedFileTypes,
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const allowedMimeTypes = useMemo(
    () => [...allowedImageMimeTypes, ...allowedVideoMimeTypes],
    [allowedImageMimeTypes, allowedVideoMimeTypes]
  );

  const bytesToMB = (bytes) => Math.round(bytes / Math.pow(1024, 2), 2);

  const isValidType = useCallback(
    ({ type }) => {
      return allowedMimeTypes.includes(type);
    },
    [allowedMimeTypes]
  );

  const fileSizeCheck = useCallback(
    ({ size }) => {
      return size <= maxUpload;
    },
    [maxUpload]
  );

  /**
   * Uploads a file.
   *
   * @param {Object} file File object.
   * @param {Object} _additionalData Additional Data object.
   */
  const uploadFile = useCallback(
    (file, _additionalData = {}) => {
      if (!hasUploadMediaAction) {
        const message = __(
          'Sorry, you are unable to upload files.',
          'web-stories'
        );
        const permissionError = createError(
          'PermissionError',
          file.name,
          message
        );

        throw permissionError;
      }
      if (!fileSizeCheck(file)) {
        const message = sprintf(
          /* translators: first %s is the file size in MB and second %s is the upload file limit in MB */
          __(
            'Your file is %1$sMB and the upload limit is %2$sMB. Please resize and try again!',
            'web-stories'
          ),
          bytesToMB(file.size),
          bytesToMB(maxUpload)
        );
        const sizeError = createError('SizeError', file.name, message);

        throw sizeError;
      }

      if (!isValidType(file)) {
        /* translators: %s is a list of allowed file extensions. */
        const message = sprintf(
          /* translators: %s: list of allowed file types. */
          __('Please choose only %s to upload.', 'web-stories'),
          allowedFileTypes.join(
            /* translators: delimiter used in a list */
            __(', ', 'web-stories')
          )
        );

        const validError = createError('ValidError', file.name, message);

        throw validError;
      }

      const additionalData = {
        post: storyId,
        media_source: 'editor',
        ..._additionalData,
      };

      return uploadMedia(file, additionalData);
    },
    [
      allowedFileTypes,
      fileSizeCheck,
      hasUploadMediaAction,
      isValidType,
      maxUpload,
      uploadMedia,
      storyId,
    ]
  );

  return {
    uploadFile,
    isValidType,
  };
}

export default useUploader;
