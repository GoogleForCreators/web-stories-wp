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
import { canTranscodeResource, resourceList } from '@web-stories-wp/media';
import { sprintf, translateToExclusiveList, __ } from '@web-stories-wp/i18n';
import { useCallback, useMemo, useRef } from '@web-stories-wp/react';
import { useSnackbar } from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { useConfig, useLocalMedia, useStory } from '..';
import useFFmpeg from '../media/utils/useFFmpeg';
import Context from './context';

function OpenMediaUploadHandler({ onOpenMediaUpload, ...props }) {
  /**
   * `open` needs to be stored in a ref so that it does not cause endless
   * re-renders for any children.
   */
  const openRef = useRef(open);
  openRef.current = onOpenMediaUpload;

  return (
    <Context.Provider
      {...props}
      value={{ onOpenMediaUpload: openRef.current }}
    />
  );
}
OpenMediaUploadHandler.propTypes = {
  onOpenMediaUpload: PropTypes.func.isRequired,
};

/**
 * The media upload provider.
 *
 * The `MediaUpload` component is passed into the application from the
 * config. There is not a way to access the `open` function outside
 * of the `render` prop. This provider gives a way to access the `open`
 * function for use anywhere in the application, passed through context.
 *
 * NOTE: Every time the wording and functionality of the modal
 * needs to change, the provider must be re-rendered with those arguments!!!
 *
 * Ex:
 * ```js
 * return (
 *  <MediaUploadProvider
 *    title={__('Select media', 'web-stories')}
 *    buttonInsertText={__('Insert media', 'web-stories')}
 *  >
 *    {...}
 *  </MediaUploadProvider>
 * )
 * ```
 * vs
 * ```js
 * return (
 *  <MediaUploadProvider
 *    title={__('Replace media', 'web-stories')}
 *    buttonInsertText={__('Put in the media', 'web-stories')}
 *  >
 *    {...}
 *  </MediaUploadProvider>
 * )
 * ```
 *
 * @param {Object} props Provider props
 * @param {Node} props.children The children
 * @return {Node} The wrapped children
 */
function MediaUploadProvider({ children, ...props }) {
  const {
    allowedTranscodableMimeTypes,
    allowedFileTypes,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    // capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();
  const { showSnackbar } = useSnackbar();
  const { selectedElements, updateElementsById } = useStory(
    ({ state: { selectedElements }, actions: { updateElementsById } }) => ({
      selectedElements,
      updateElementsById,
    })
  );
  const { resetWithFetch, updateVideoIsMuted, optimizeVideo, optimizeGif } =
    useLocalMedia(
      ({
        actions: {
          resetWithFetch,
          updateVideoIsMuted,
          optimizeVideo,
          optimizeGif,
        },
      }) => {
        return {
          resetWithFetch,
          updateVideoIsMuted,
          optimizeVideo,
          optimizeGif,
        };
      }
    );

  const { isTranscodingEnabled } = useFFmpeg();

  const allowedMimeTypes = useMemo(() => {
    if (isTranscodingEnabled) {
      return [
        ...allowedTranscodableMimeTypes,
        ...allowedImageMimeTypes,
        ...allowedVideoMimeTypes,
      ];
    }
    return [...allowedImageMimeTypes, ...allowedVideoMimeTypes];
  }, [
    allowedImageMimeTypes,
    allowedVideoMimeTypes,
    isTranscodingEnabled,
    allowedTranscodableMimeTypes,
  ]);

  const transcodableMimeTypes = useMemo(() => {
    return allowedTranscodableMimeTypes.filter(
      (x) => !allowedVideoMimeTypes.includes(x)
    );
  }, [allowedTranscodableMimeTypes, allowedVideoMimeTypes]);

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
        properties: { resource },
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
        // WordPress media picker event, sizes.medium.source_url is the smallest image
        insertMediaElement(
          resource,
          resource.sizes?.medium?.source_url || resource.src
        );

        if (
          !resource.local &&
          allowedVideoMimeTypes.includes(resource.mimeType) &&
          resource.isMuted === null
        ) {
          updateVideoIsMuted(resource.id, resource.src);
        }
      } catch (e) {
        showSnackbar({
          message: e.message,
          dismissable: true,
        });
      }
    },
    [
      allowedVideoMimeTypes,
      insertMediaElement,
      isTranscodingEnabled,
      optimizeGif,
      optimizeVideo,
      showSnackbar,
      transcodableMimeTypes,
      updateVideoIsMuted,
    ]
  );

  return (
    <MediaUpload
      {...props}
      onSelect={handleMediaSelect}
      onClose={resetWithFetch}
      type={allowedMimeTypes}
      onSelectErrorMessage={onSelectErrorMessage}
      render={(open) => (
        /* the only way to access `open` is through the render prop of `MediaUpload` */
        <OpenMediaUploadHandler onOpenMediaUpload={open}>
          {children}
        </OpenMediaUploadHandler>
      )}
    />
  );
}
MediaUploadProvider.propTypes = {
  buttonInsertText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  cropParams: PropTypes.bool,
  multiple: PropTypes.bool,
  onClose: PropTypes.func,
  onPermissionError: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onSelectErrorMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default MediaUploadProvider;
