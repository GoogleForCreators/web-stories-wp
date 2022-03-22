/*
 * Copyright 2021 Google LLC
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
import { useSnackbar } from '@googleforcreators/design-system';
import { useCallback, useMemo } from '@googleforcreators/react';
import { getExtensionsFromMimeType } from '@googleforcreators/media';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useConfig, useLocalMedia } from '../../app';
import useFFmpeg from '../../app/media/utils/useFFmpeg';
import { TRANSCODABLE_MIME_TYPES } from '../../app/media';

function MediaUploadButton({ onInsert, renderButton, buttonInsertText }) {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      vector: allowedVectorMimeTypes,
      video: allowedVideoMimeTypes,
    },
    MediaUpload,
  } = useConfig();

  const allowedUploadMimeTypes = useMemo(
    () => [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ],
    [allowedImageMimeTypes, allowedVectorMimeTypes, allowedVideoMimeTypes]
  );
  const allowedFileTypes = useMemo(
    () =>
      allowedUploadMimeTypes
        .map((type) => getExtensionsFromMimeType(type))
        .flat(),
    [allowedUploadMimeTypes]
  );

  const {
    canTranscodeResource,
    resetWithFetch,
    postProcessingResource,
    optimizeVideo,
    optimizeGif,
  } = useLocalMedia(
    ({
      state: { canTranscodeResource },
      actions: {
        resetWithFetch,
        postProcessingResource,
        optimizeVideo,
        optimizeGif,
      },
    }) => {
      return {
        canTranscodeResource,
        resetWithFetch,
        postProcessingResource,
        optimizeVideo,
        optimizeGif,
      };
    }
  );
  const { isTranscodingEnabled } = useFFmpeg();
  const { showSnackbar } = useSnackbar();

  const allowedMimeTypes = useMemo(() => {
    if (isTranscodingEnabled) {
      return [
        ...TRANSCODABLE_MIME_TYPES,
        ...allowedImageMimeTypes,
        ...allowedVectorMimeTypes,
        ...allowedVideoMimeTypes,
      ];
    }
    return [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ];
  }, [
    allowedImageMimeTypes,
    allowedVectorMimeTypes,
    allowedVideoMimeTypes,
    isTranscodingEnabled,
  ]);

  const transcodableMimeTypes = useMemo(() => {
    return TRANSCODABLE_MIME_TYPES.filter(
      (x) => !allowedVideoMimeTypes.includes(x)
    );
  }, [allowedVideoMimeTypes]);

  let onSelectErrorMessage = __(
    'No file types are currently supported.',
    'web-stories'
  );
  if (allowedFileTypes.length) {
    onSelectErrorMessage = sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s to insert into page.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }

  const onSelect = useCallback(
    (resource) => {
      try {
        if (isTranscodingEnabled && canTranscodeResource(resource)) {
          if (transcodableMimeTypes.includes(resource.mimeType)) {
            optimizeVideo({ resource });
          }

          if (resource.mimeType === 'image/gif') {
            optimizeGif({ resource });
          }
        }
        onInsert(resource);

        postProcessingResource(resource);
      } catch (e) {
        showSnackbar({
          message: e.message,
          dismissible: true,
        });
      }
    },
    [
      isTranscodingEnabled,
      canTranscodeResource,
      onInsert,
      optimizeGif,
      optimizeVideo,
      postProcessingResource,
      showSnackbar,
      transcodableMimeTypes,
    ]
  );

  return (
    <MediaUpload
      onSelect={onSelect}
      onSelectErrorMessage={onSelectErrorMessage}
      onClose={resetWithFetch}
      type={allowedMimeTypes}
      render={renderButton}
      buttonInsertText={buttonInsertText}
    />
  );
}

MediaUploadButton.propTypes = {
  onInsert: PropTypes.func.isRequired,
  renderButton: PropTypes.func.isRequired,
  buttonInsertText: PropTypes.string,
};

export default MediaUploadButton;
