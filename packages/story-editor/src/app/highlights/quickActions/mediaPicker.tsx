/*
 * Copyright 2022 Google LLC
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
import {
  getExtensionsFromMimeType,
  resourceList,
} from '@googleforcreators/media';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { TRANSCODABLE_MIME_TYPES, useLocalMedia } from '../../media';
import { useConfig } from '../../config';
import { useStory } from '../../story';

interface RenderProps {
  onClick: () => void;
}
interface MediaPickerProps {
  buttonInsertText?: string;
  cropParams?: boolean;
  multiple?: boolean;
  onClose?: () => void;
  onPermissionError?: () => void;
  onSelect: (resource: Resource) => void;
  onSelectErrorMessage?: string;
  render: (props: RenderProps) => void;
  title?: string;
  type: string | string[];
}

function MediaPicker({ render, ...props }: MediaPickerProps) {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      vector: allowedVectorMimeTypes,
      video: allowedVideoMimeTypes,
    },
    MediaUpload,
  } = useConfig();

  const { selectedElements, updateElementsById } = useStory(
    ({ state, actions }) => ({
      selectedElements: state.selectedElements,
      updateElementsById: actions.updateElementsById,
    })
  );

  const {
    resetWithFetch,
    postProcessingResource,
    optimizeVideo,
    optimizeGif,
    canTranscodeResource,
  } = useLocalMedia(({ state, actions }) => ({
    canTranscodeResource: state.canTranscodeResource,
    resetWithFetch: actions.resetWithFetch,
    postProcessingResource: actions.postProcessingResource,
    optimizeVideo: actions.optimizeVideo,
    optimizeGif: actions.optimizeGif,
  }));

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
    () =>
      allowedMimeTypes.map((type) => getExtensionsFromMimeType(type)).flat(),
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
    (resource: Resource, thumbnailURL: string) => {
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
    (resource: Resource) => {
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
}

export default MediaPicker;
