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
import PropTypes from 'prop-types';
import { useCallback, useMemo } from '@googleforcreators/react';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { useSnackbar } from '@googleforcreators/design-system';
import {
  getExtensionsFromMimeType,
  resourceList,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import { useStory } from '../story';
import { TRANSCODABLE_MIME_TYPES, useLocalMedia } from '../media';
import useFFmpeg from '../media/utils/useFFmpeg';

const MediaPicker = ({ render, ...props }) => {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      vector: allowedVectorMimeTypes,
      video: allowedVideoMimeTypes,
    },
    MediaUpload,
  } = useConfig();

  const { selectedElements, updateElementsById } = useStory(
    ({ state: { selectedElements }, actions: { updateElementsById } }) => ({
      selectedElements,
      updateElementsById,
    })
  );
  const {
    resetWithFetch,
    postProcessingResource,
    optimizeVideo,
    optimizeGif,
    canTranscodeResource,
  } = useLocalMedia(
    ({
      state: { canTranscodeResource },
      actions: {
        resetWithFetch,
        postProcessingResource,
        optimizeVideo,
        optimizeGif,
      },
    }) => ({
      canTranscodeResource,
      resetWithFetch,
      postProcessingResource,
      optimizeVideo,
      optimizeGif,
    })
  );

  const { isTranscodingEnabled } = useFFmpeg();
  const { showSnackbar } = useSnackbar();

  // Media Upload Props
  let allowedMimeTypes = useMemo(
    () => [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ],
    [allowedImageMimeTypes, allowedVectorMimeTypes, allowedVideoMimeTypes]
  );
  const allowedFileTypes = useMemo(
    () => allowedMimeTypes.flatMap((type) => getExtensionsFromMimeType(type)),
    [allowedMimeTypes]
  );
  if (isTranscodingEnabled) {
    allowedMimeTypes = allowedMimeTypes.concat(TRANSCODABLE_MIME_TYPES);
  }

  const transcodableMimeTypes = TRANSCODABLE_MIME_TYPES.filter(
    (x) => !allowedVideoMimeTypes.includes(x)
  );

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

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @param {string} thumbnailURL The thumbnail's url
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource, thumbnailURL) => {
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      updateElementsById({
        elementIds: [selectedElements?.[0]?.id],
        properties: { type: resource.type, resource },
      });
    },
    [selectedElements, updateElementsById]
  );

  const handleMediaSelect = useCallback(
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
        // WordPress media picker event, sizes.medium.sourceUrl is the smallest image
        insertMediaElement(
          resource,
          resource.sizes?.medium?.sourceUrl || resource.src
        );

        postProcessingResource(resource);
      } catch (e) {
        showSnackbar({
          message: e.message,
          dismissable: true,
        });
      }
    },
    [
      isTranscodingEnabled,
      canTranscodeResource,
      insertMediaElement,
      postProcessingResource,
      transcodableMimeTypes,
      optimizeVideo,
      optimizeGif,
      showSnackbar,
    ]
  );
  return (
    <MediaUpload
      title={__('Replace media', 'web-stories')}
      buttonInsertText={__('Replace media', 'web-stories')}
      onSelect={handleMediaSelect}
      onClose={resetWithFetch}
      type={allowedMimeTypes}
      onSelectErrorMessage={onSelectErrorMessage}
      // Only way to access the open function is to dive
      // into the MediaUpload component in the render prop.
      render={(open) => render({ onClick: open })}
      {...props}
    />
  );
};
MediaPicker.propTypes = {
  buttonInsertText: PropTypes.string,
  cropParams: PropTypes.bool,
  multiple: PropTypes.bool,
  onClose: PropTypes.func,
  onPermissionError: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectErrorMessage: PropTypes.string,
  render: PropTypes.func.isRequired,
  title: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default MediaPicker;
