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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useConfig } from '../config';
import { useMedia } from '../media';

function useUploader(refreshLibrary = true) {
  const {
    actions: { resetWithFetch },
  } = useMedia();
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
  } = useConfig();
  const allowedMimeTypes = [...allowedImageMimeTypes, ...allowedVideoMimeTypes];

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

  const uploadFile = (file) => {
    // TODO Add permission check here, see Gutenberg's userCan function.
    if (!fileSizeCheck(file)) {
      const sizeError = new Error();
      sizeError.name = 'SizeError';
      sizeError.file = file.name;
      sizeError.isUserError = true;

      sizeError.message = sprintf(
        /* translators: first %s is the file size in MB and second %s is the upload file limit in MB */
        __(
          'Your file is %1$sMB and the upload limit is %2$sMB. Please resize and try again!',
          'web-stories'
        ),
        bytesToMB(file.size),
        bytesToMB(maxUpload)
      );
      throw sizeError;
    }

    if (!isValidType(file)) {
      const validError = new Error();
      validError.isUserError = true;
      validError.name = 'ValidError';
      validError.file = file.name;

      /* translators: %s is a list of allowed file extensions. */
      validError.message = createInterpolateElement(
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
      );
      throw validError;
    }

    const additionalData = {
      post: storyId,
    };

    const promise = uploadMedia(file, additionalData);
    if (refreshLibrary) {
      promise.finally(resetWithFetch);
    }
    return promise;
  };

  return {
    uploadFile,
    isValidType,
  };
}

export default useUploader;
