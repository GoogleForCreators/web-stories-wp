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
import {
  trackError,
  trackEvent,
  getTimeTracker,
} from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useConfig } from '../config';
import createError from '../../utils/createError';
import useTranscodeVideo from '../media/utils/useTranscodeVideo';
import { MEDIA_TRANSCODING_MAX_FILE_SIZE } from '../../constants';

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
  const {
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    transcodeVideo,
    isFileTooLarge,
  } = useTranscodeVideo();

  const bytesToMB = (bytes) => Math.round(bytes / Math.pow(1024, 2), 2);

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
   * Uploads a file.
   *
   * @param {Object} file File object.
   * @param {Object} _additionalData Additional Data object.
   */
  const uploadFile = useCallback(
    async (file, _additionalData = {}) => {
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

      const additionalData = {
        post: storyId,
        media_source: 'editor',
        ..._additionalData,
      };

      if (
        !isFeatureEnabled ||
        !isTranscodingEnabled ||
        !canTranscodeFile(file)
      ) {
        // The file type is not supported by default, and cannot be transcoded either.
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

          throw createError('ValidError', file.name, message);
        }

        // TODO: If !isTranscodingEnabled && canTranscodeFile(), tell user to enable transcoding.

        // If transcoding is not enabled, just upload the file normally without any transcoding.
        return uploadMedia(file, additionalData);
      }

      // Bail early if the file is too large for transcoding.
      if (isFileTooLarge(file)) {
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

      trackEvent('video_transcoding', 'editor', '', '', {
        file_size: file.size,
        file_type: file.type,
      });
      const trackTiming = getTimeTracker(
        'video_transcoding',
        'editor',
        'Media'
      );

      // Transcoding is enabled, let's give it a try!
      try {
        // TODO: Only transcode & optimize video if needed (criteria TBD).
        const newFile = await transcodeVideo(file);
        trackTiming();
        additionalData.media_source = 'video-optimization';
        return uploadMedia(newFile, additionalData);
      } catch (err) {
        trackTiming();
        trackError('video_transcoding', err.message);

        const message = __('Video could not be processed', 'web-stories');
        throw createError('TranscodingError', file.name, message);
      }
    },
    [
      allowedFileTypes,
      isFileSizeWithinLimits,
      hasUploadMediaAction,
      isValidType,
      maxUpload,
      uploadMedia,
      storyId,
      isFeatureEnabled,
      isTranscodingEnabled,
      canTranscodeFile,
      transcodeVideo,
      isFileTooLarge,
    ]
  );

  return {
    uploadFile,
    isValidType,
  };
}

export default useUploader;
