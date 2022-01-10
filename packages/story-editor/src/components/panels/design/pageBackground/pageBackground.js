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
import { useCallback, useMemo } from '@web-stories-wp/react';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text as DefaultText,
  THEME_CONSTANTS,
  Tooltip,
  useSnackbar,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { Color, Row as DefaultRow } from '../../../form';
import { useConfig, useLocalMedia, useStory } from '../../../../app';
import { SimplePanel } from '../../panel';
import { FlipControls } from '../../shared';
import { createNewElement, getDefinitionForType } from '../../../../elements';
import { states, styles, useHighlights } from '../../../../app/highlights';
import useFFmpeg from '../../../../app/media/utils/useFFmpeg';
import getElementProperties from '../../../canvas/utils/getElementProperties';

const DEFAULT_FLIP = { horizontal: false, vertical: false };

const Row = styled(DefaultRow)`
  justify-content: flex-start;
`;

const SelectedMedia = styled.div`
  width: 128px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  display: flex;
  justify-content: space-between;
  margin-right: 12px;
`;

const MediaWrapper = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  overflow: hidden;
  margin: 5px;
  img {
    object-fit: cover;
    max-height: 100%;
    max-width: 100%;
  }
`;

const RemoveButton = styled(Button)`
  margin: 1px;
  align-self: center;
`;

const ReplaceButton = styled(Button).attrs({
  size: BUTTON_SIZES.SMALL,
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
})`
  margin-right: 8px;
`;

const Text = styled(DefaultText)`
  align-self: center;
  width: 55px;
`;

function PageBackgroundPanel({ selectedElements, pushUpdate }) {
  const {
    combineElements,
    currentPage,
    clearBackgroundElement,
    updateCurrentPageProperties,
  } = useStory(({ state, actions }) => ({
    currentPage: state.currentPage,
    clearBackgroundElement: actions.clearBackgroundElement,
    combineElements: actions.combineElements,
    updateCurrentPageProperties: actions.updateCurrentPageProperties,
  }));

  const {
    allowedTranscodableMimeTypes,
    allowedFileTypes,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();

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

  const updateBackgroundColor = useCallback(
    (value) => {
      updateCurrentPageProperties({ properties: { backgroundColor: value } });
    },
    [updateCurrentPageProperties]
  );

  const removeAsBackground = useCallback(() => {
    pushUpdate(
      {
        isBackground: false,
        opacity: 100,
      },
      true
    );
    clearBackgroundElement();
  }, [pushUpdate, clearBackgroundElement]);

  const transcodableMimeTypes = useMemo(() => {
    return allowedTranscodableMimeTypes.filter(
      (x) => !allowedVideoMimeTypes.includes(x)
    );
  }, [allowedTranscodableMimeTypes, allowedVideoMimeTypes]);

  /**
   * Callback of select in media picker to replace background media.
   *
   * @param {Object} resource Object coming from backbone media picker.
   */
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
        // WordPress media picker event, sizes.medium.source_url is the smallest image
        const element = createNewElement(
          resource.type,
          getElementProperties(resource.type, { resource })
        );
        combineElements({
          firstElement: element,
          secondId: selectedElements[0].id,
        });

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
      combineElements,
      optimizeGif,
      optimizeVideo,
      postProcessingResource,
      selectedElements,
      showSnackbar,
      transcodableMimeTypes,
    ]
  );

  const renderReplaceButton = useCallback(
    (open) => (
      <ReplaceButton onClick={open} aria-label={__('Replace', 'web-stories')}>
        <Icons.ArrowCloud />
      </ReplaceButton>
    ),
    []
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

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.PAGE_BACKGROUND],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  const backgroundEl = selectedElements[0];
  if (!backgroundEl || !backgroundEl.isBackground) {
    return null;
  }
  const isDefaultBackground = backgroundEl.isDefaultBackground;
  const isMedia = backgroundEl.isBackground && !isDefaultBackground;

  const { backgroundColor } = currentPage;
  const { LayerIcon } = getDefinitionForType(backgroundEl.type);

  // Background can only have one selected element.
  const flip = selectedElements[0]?.flip || DEFAULT_FLIP;

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="pageBackground"
      title={__('Page Background', 'web-stories')}
      isPersistable={!highlight}
      collapsedByDefault={false}
    >
      {isDefaultBackground && (
        <Row>
          <Color
            ref={(node) => {
              if (node && highlight?.focus && highlight?.showEffect) {
                node.addEventListener('keydown', cancelHighlight, {
                  once: true,
                });
                node.focus();
              }
            }}
            allowsGradient
            value={backgroundColor}
            onChange={updateBackgroundColor}
            label={__('Background color', 'web-stories')}
            allowsSavedColors
            allowsOpacity={false}
          />
        </Row>
      )}
      {isMedia && (
        <Row expand={false}>
          <SelectedMedia>
            <MediaWrapper>
              <LayerIcon element={backgroundEl} />
            </MediaWrapper>
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
              {__('Media', 'web-stories')}
            </Text>
            <RemoveButton
              aria-label={__('Detach background', 'web-stories')}
              onClick={removeAsBackground}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
              type={BUTTON_TYPES.TERTIARY}
            >
              <Icons.Cross />
            </RemoveButton>
          </SelectedMedia>
          {hasUploadMediaAction && (
            <Tooltip title={__('Replace', 'web-stories')}>
              <MediaUpload
                onSelect={onSelect}
                onSelectErrorMessage={onSelectErrorMessage}
                onClose={resetWithFetch}
                type={allowedMimeTypes}
                render={renderReplaceButton}
                buttonInsertText={__('Add as background', 'web-stories')}
              />
            </Tooltip>
          )}
          <FlipControls
            onChange={(value) => pushUpdate({ flip: value }, true)}
            value={flip}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

PageBackgroundPanel.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};

export default PageBackgroundPanel;
