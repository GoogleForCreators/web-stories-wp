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
import styled from 'styled-components';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import {
  Snackbar,
  useSnackbar,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { canTranscodeResource, resourceList } from '@web-stories-wp/media';
import { useCallback, useMemo } from '@web-stories-wp/react';
import Proptypes from 'prop-types';
/**
 * Internal dependencies
 */
import Library from '../library';
import Workspace from '../workspace';
import {
  CANVAS_MIN_WIDTH,
  LIBRARY_MIN_WIDTH,
  LIBRARY_MAX_WIDTH,
  INSPECTOR_MIN_WIDTH,
  INSPECTOR_MAX_WIDTH,
} from '../../constants';
import withOverlay from '../overlay/withOverlay';
import { CanvasProvider } from '../../app/canvas';
import { HighlightsProvider } from '../../app/highlights';
import LayoutProvider from '../../app/layout/layoutProvider';
import { ChecklistCheckpointProvider } from '../checklist';
import { RightClickMenuProvider } from '../../app/rightClickMenu';
import RightClickMenu from '../canvas/rightClickMenu';
import { MediaUploadProvider } from '../../app/mediaUpload';
import { useConfig } from '../../app/config';
import { useStory } from '../../app/story';
import { useLocalMedia } from '../../app';
import useFFmpeg from '../../app/media/utils/useFFmpeg';

const Editor = withOverlay(styled.section.attrs({
  'aria-label': __('Web Stories Editor', 'web-stories'),
})`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { MEDIUM }) => paragraph[MEDIUM]
  )}
  background-color: ${({ theme }) => theme.colors.bg.primary};

  position: relative;
  height: 100%;
  width: 100%;

  display: grid;
  grid:
    'lib   canv        insp' 1fr
    'lib   supplementary insp' auto /
    minmax(${LIBRARY_MIN_WIDTH}px, ${LIBRARY_MAX_WIDTH}px)
    minmax(${CANVAS_MIN_WIDTH}px, 1fr)
    minmax(${INSPECTOR_MIN_WIDTH}px, ${INSPECTOR_MAX_WIDTH}px);
`);

const Area = styled.div`
  grid-area: ${({ area }) => area};
  position: relative;
  overflow: hidden;
  z-index: 2;
`;

function Layout({ header, children }) {
  const snackbarState = useSnackbar(
    ({ removeSnack, currentSnacks, placement }) => ({
      onRemove: removeSnack,
      notifications: currentSnacks,
      placement,
    })
  );
  const {
    allowedTranscodableMimeTypes,
    allowedFileTypes,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    // capabilities: { hasUploadMediaAction },
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

  // Media Upload Props
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
    <>
      <LayoutProvider>
        <ChecklistCheckpointProvider>
          <MediaUploadProvider
            title={__('Replace media', 'web-stories')}
            buttonInsertText={__('Insert media', 'web-stories')}
            onSelect={handleMediaSelect}
            onClose={resetWithFetch}
            type={allowedMimeTypes}
            onSelectErrorMessage={onSelectErrorMessage}
          >
            <HighlightsProvider>
              <Editor zIndex={3}>
                <CanvasProvider>
                  <RightClickMenuProvider>
                    <Area area="lib">
                      <Library />
                    </Area>
                    <Workspace header={header} />
                    <RightClickMenu />
                  </RightClickMenuProvider>
                </CanvasProvider>
                {children}
              </Editor>
            </HighlightsProvider>
          </MediaUploadProvider>
        </ChecklistCheckpointProvider>
      </LayoutProvider>
      <Snackbar.Container {...snackbarState} />
    </>
  );
}

Layout.propTypes = {
  children: Proptypes.node,
  header: Proptypes.node,
};

export default Layout;
