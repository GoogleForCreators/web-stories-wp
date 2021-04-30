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
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../api';
import { useConfig } from '../config';
import createError from '../../utils/createError';
import { MEDIA_TRANSCODING_MAX_FILE_SIZE } from '../../constants';

const bytesToMB = (bytes) => Math.round(bytes / Math.pow(1024, 2));

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

  const isValidType = useCallback(
    ({ type }) => {
      return allowedMimeTypes.includes(type);
    },
    [allowedMimeTypes]
  );

  const isFileSizeWithinLimits = useCallback(
    ({ size }) => {
      return size <= maxUpload;
    },
    [maxUpload]
  );

  /**
   * Validates a file for upload.
   *
   * @throws Throws an error if file doesn't meet requirements.
   *
   * @param {Object} file File object.
   * @param {boolean} canTranscodeFile Whether file can be transcoded by consumer.
   * @param {boolean} isFileTooLarge Whether file is too large for consumer.
   */
  const validateFileForUpload = useCallback(
    (file, canTranscodeFile, isFileTooLarge) => {
      // Bail early if user doesn't have upload capabilities.
      if (!hasUploadMediaAction) {
        const message = __(
          'Sorry, you are unable to upload files.',
          'web-stories'
        );
        throw createError('PermissionError', file.name, message);
      }

      // The file is too large for the site anyway, abort.
      if (!isFileSizeWithinLimits(file)) {
        const message = sprintf(
          /* translators: first %s is the file size in MB and second %s is the upload file limit in MB */
          __(
            'Your file is %1$sMB and the upload limit is %2$sMB. Please resize and try again!',
            'web-stories'
          ),
          bytesToMB(file.size),
          bytesToMB(maxUpload)
        );
        throw createError('SizeError', file.name, message);
      }

      // TODO: Move this check to useUploadMedia?
      if (!isValidType(file) && !canTranscodeFile) {
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

      // TODO: Move this check to useUploadMedia?
      if (isFileTooLarge) {
        const message = sprintf(
          /* translators: 1: File size in MB. 2: Maximum allowed file size in MB. */
          __(
            'Your file is too large (%1$s MB) and cannot be processed. Please try again with a file that is smaller than %2$s MB.',
            'web-stories'
          ),
          bytesToMB(file.size),
          bytesToMB(MEDIA_TRANSCODING_MAX_FILE_SIZE)
        );
        throw createError('SizeError', file.name, message);
      }
    },
    [
      hasUploadMediaAction,
      isFileSizeWithinLimits,
      maxUpload,
      allowedFileTypes,
      isValidType,
    ]
  );

  /**
   * Uploads a file.
   *
   * @param {Object} file File object.
   * @param {Object} additionalData Additional Data object.
   */
  const uploadFile = useCallback(
    (file, additionalData = {}) => {
      // This will throw if the file cannot be uploaded.
      validateFileForUpload(file);

      const _additionalData = {
        post: storyId,
        media_source: 'editor',
        ...additionalData,
      };

      return uploadMedia(file, _additionalData);
    },
    [validateFileForUpload, uploadMedia, storyId]
  );

  return useMemo(() => {
    return {
      actions: {
        uploadFile,
        validateFileForUpload,
      },
    };
  }, [validateFileForUpload, uploadFile]);
}

export default useUploader;
