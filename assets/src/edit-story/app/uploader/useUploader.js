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
import { __experimentalCreateInterpolateElement as createInterpolateElement } from '@wordpress/element';

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

  const validErrorMessage = createInterpolateElement(
    sprintf(
      __('Please choose only <b>%s</b> to upload.', 'web-stories'),
      allowedMimeTypes.join(', ')
    ),
    {
      b: <b />,
    }
  );

  const sizeErrorMessage = sprintf(
    __(
      'Your files is larger than the upload limit. The upload limit is %sMB. Please resize and try again!',
      'web-stories'
    ),
    bytesToMB(maxUpload)
  );

  const uploadFile = (file) => {
    // TODO Add permission check here, see Gutenberg's userCan function.
    if (!fileSizeCheck(file)) {
      const SizeError = new Error();
      SizeError.name = 'SizeError';
      SizeError.file = file.name;
      SizeError.message = sprintf(
        __(
          'Your file is %sMB and the upload limit is %sMB. Please resize and try again!',
          'web-stories'
        ),
        bytesToMB(file.size),
        bytesToMB(maxUpload)
      );
      throw SizeError;
    }

    if (!isValidType(file)) {
      const ValidError = new Error();
      ValidError.message = createInterpolateElement(
        sprintf(
          __('Please choose only <b>%s</b> to upload.', 'web-stories'),
          allowedMimeTypes.join(', ')
        ),
        {
          b: <b />,
        }
      );
      ValidError.name = 'ValidError';
      ValidError.file = file.name;
      throw ValidError;
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
    validErrorMessage,
    sizeErrorMessage,
  };
}

export default useUploader;
