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
import { useCallback, useMemo } from '@googleforcreators/react';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import {
  getFileBasename,
  getExtensionsFromMimeType,
} from '@googleforcreators/media';

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
      vector: allowedVectorMimeTypes,
      video: allowedVideoMimeTypes,
    },
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const allowedMimeTypes = useMemo(
    () => [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ],
    [allowedImageMimeTypes, allowedVectorMimeTypes, allowedVideoMimeTypes]
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
   * @param {Object} args
   * @param {Object} args.file File object.
   * @param {boolean} args.canTranscodeFile Whether file can be transcoded by consumer.
   * @param {boolean} args.isFileTooLarge Whether file is too large for consumer.
   * @param {Array} args.overrideAllowedMimeTypes Array of override allowed mime types.
   */
  const validateFileForUpload = useCallback(
    ({
      file,
      canTranscodeFile,
      isFileTooLarge,
      overrideAllowedMimeTypes = allowedMimeTypes,
    }) => {
      // Bail early if user doesn't have upload capabilities.
      if (!hasUploadMediaAction) {
        const message = __(
          'Sorry, you are not allowed to upload files.',
          'web-stories'
        );
        throw createError('PermissionError', file.name, message);
      }

      if (!canTranscodeFile) {
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

        const isValidType = ({ type }) =>
          overrideAllowedMimeTypes.includes(type);
        // TODO: Move this check to useUploadMedia?
        if (!isValidType(file)) {
          let message = __(
            'No file types are currently supported.',
            'web-stories'
          );

          const allowedFileTypes = overrideAllowedMimeTypes
            .map((type) => getExtensionsFromMimeType(type))
            .flat();

          if (allowedFileTypes.length) {
            /* translators: %s is a list of allowed file extensions. */
            message = sprintf(
              /* translators: %s: list of allowed file types. */
              __('Please choose only %s to upload.', 'web-stories'),
              translateToExclusiveList(allowedFileTypes)
            );
          }

          throw createError('ValidError', file.name, message);
        }
        // TODO: Move this check to useUploadMedia?
      } else if (isFileTooLarge) {
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
    [allowedMimeTypes, hasUploadMediaAction, isFileSizeWithinLimits, maxUpload]
  );

  /**
   * Uploads a file.
   *
   * @param {Object} file File object.
   * @param {Object} additionalData Additional Data object.
   * @param {Array} overrideAllowedMimeTypes Array of override allowed mime types.
   */
  const uploadFile = useCallback(
    (
      file,
      additionalData = {},
      overrideAllowedMimeTypes = allowedMimeTypes
    ) => {
      // This will throw if the file cannot be uploaded.
      validateFileForUpload({ file, overrideAllowedMimeTypes });

      const _additionalData = {
        storyId,
        altText: getFileBasename(file),
        mediaSource: 'editor',
        ...additionalData,
      };

      return uploadMedia(file, _additionalData);
    },
    [allowedMimeTypes, validateFileForUpload, storyId, uploadMedia]
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
