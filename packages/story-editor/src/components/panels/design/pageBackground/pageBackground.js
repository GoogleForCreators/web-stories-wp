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
import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
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
} from '@web-stories-wp/design-system';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { Color, MediaUploadButton, Row as DefaultRow } from '../../../form';
import { useConfig, useStory } from '../../../../app';
import { SimplePanel } from '../../panel';
import { FlipControls } from '../../shared';
import { createNewElement, getDefinitionForType } from '../../../../elements';
import { states, styles, useHighlights } from '../../../../app/highlights';
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
    capabilities: { hasUploadMediaAction },
  } = useConfig();

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

  /**
   * Callback of select in media picker to replace background media.
   *
   * @param {Object} resource Object coming from backbone media picker.
   */
  const onSelect = useCallback(
    (resource) => {
      const element = createNewElement(
        resource.type,
        getElementProperties(resource.type, { resource })
      );
      combineElements({
        firstElement: element,
        secondId: selectedElements[0].id,
      });
      trackEvent('replace_background_media');
    },
    [combineElements, selectedElements]
  );

  const renderReplaceButton = useCallback(
    (open) => (
      <ReplaceButton onClick={open} aria-label={__('Replace', 'web-stories')}>
        <Icons.ArrowCloud />
      </ReplaceButton>
    ),
    []
  );

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
              <MediaUploadButton
                buttonInsertText={__('Use as background', 'web-stories')}
                onInsert={onSelect}
                renderButton={renderReplaceButton}
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
