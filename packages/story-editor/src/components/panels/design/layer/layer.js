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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_TYPES,
  Icons,
  themeHelpers,
  Text,
  THEME_CONSTANTS,
  Input,
} from '@googleforcreators/design-system';
import { useRef, memo, useState } from '@googleforcreators/react';
import {
  getDefinitionForType,
  getLayerName,
} from '@googleforcreators/elements';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../../types';
import { useStory, useCanvas } from '../../../../app';
import useCORSProxy from '../../../../utils/useCORSProxy';
import usePerformanceTracking from '../../../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../../../constants';
import Tooltip from '../../../tooltip';
import useLayerSelection from './useLayerSelection';
import { LAYER_HEIGHT } from './constants';

const fadeOutCss = css`
  background-color: var(--background-color);

  ::before {
    position: absolute;
    content: '';
    width: 32px;
    height: 100%;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      to right,
      var(--background-color-opaque),
      var(--background-color)
    );
    pointer-events: none;
  }
`;

const ActionsContainer = styled.div`
  position: absolute;
  display: none;
  align-items: center;
  height: 100%;
  top: 0;
  right: 0;
  padding-right: 6px;
  column-gap: 6px;

  ${fadeOutCss}
`;

const LayerContainer = styled.div.attrs({
  // Because the layer panel is aria-hidden, we need something else to select by
  'data-testid': 'layer-option',
})`
  position: relative;
  height: ${LAYER_HEIGHT}px;
  width: 100%;
  overflow: hidden;

  --background-color: ${({ theme }) => theme.colors.bg.secondary};
  --background-color-opaque: ${({ theme }) =>
    rgba(theme.colors.bg.secondary, 0)};

  :is(:hover, :focus-within) ${ActionsContainer} {
    display: inline-flex;
  }
`;

const LayerButton = styled(Button).attrs({
  type: BUTTON_TYPES.PLAIN,
  tabIndex: -1,
  role: 'option',
})`
  position: relative;
  display: grid;
  grid-template-columns: 36px 1fr;

  border: 0;
  padding: 0;
  background: transparent;
  height: 100%;
  width: 100%;
  overflow: hidden;
  align-items: center;
  user-select: none;
  border-radius: 0;
  padding-left: ${({ isNested }) => (isNested ? 30 : 12)}px;
  transition: revert;

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      background: ${theme.colors.interactiveBg.tertiaryPress};
      &,
      & + * {
        --background-color: ${theme.colors.interactiveBg.tertiaryPress};
        --background-color-opaque: ${rgba(
          theme.colors.interactiveBg.tertiaryPress,
          0
        )};
        --selected-hover-color: ${theme.colors.interactiveBg.tertiaryHover};
      }
    `}

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryHover};
  }
  :hover,
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryHover, 0)};
  }

  :active {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryPress};
  }
  :active,
  :active + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryPress};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryPress, 0)};
  }
`;

const LayerInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 23px 1fr;
  height: 100%;
  width: 100%;
  padding-left: 12px;
  padding-right: 10px;

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryHover};
  }
  :hover,
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryHover, 0)};
  }
`;

const LayerInput = styled(Input)`
  overflow: visible;

  div {
    height: 100%;
  }
`;

const LayerIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.colors.fg.primary};

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryHover};
  }
  :hover,
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryHover, 0)};
  }
`;

const LayerDescription = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-left: 0;
  text-align: left;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const LayerInputForm = styled(LayerDescription).attrs({ as: 'form' })`
  overflow: visible;
  margin-left: 2px;
`;

const LayerText = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: inherit;
  white-space: nowrap;
  text-overflow: ' ';
  overflow: hidden;
  max-width: 100%;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  right: 0;
  width: 32px;
  aspect-ratio: 1;

  ${fadeOutCss}

  svg {
    position: relative;
    display: block;
    width: 100%;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

const LayerContentContainer = styled.div`
  margin-right: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const LayerAction = styled(Button).attrs({
  type: BUTTON_TYPES.PLAIN,
  tabIndex: -1,
})`
  position: relative;
  aspect-ratio: 1;
  width: 20px;
  padding: 0;

  /*
   * all of our Icons right now have an embedded padding,
   * however the new designs just disregard this embedded
   * padding, so to accommodate, we'll make the icon its
   * intended size and manually center it within the button.
   */
  svg {
    position: absolute;
    width: 32px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /*
   * override base button background color so we can receive the
   * proper background color from the parent.
   */
  && {
    transition: revert;
    background: var(--background-color);
  }

  :disabled {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }

  :hover {
    color: var(
      --selected-hover-color,
      ${({ theme }) => theme.colors.fg.secondary}
    );
  }

  & + & {
    margin-left: 4px;
  }

  * {
    pointer-events: none;
  }

  :focus {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        'var(--background-color)'
      )}
  }
`;

function preventReorder(e) {
  e.stopPropagation();
  e.preventDefault();
}

function Layer({ element }) {
  const layerName = getLayerName(element);
  const [newLayerName, setNewLayerName] = useState(layerName);
  const isLayerLockingEnabled = useFeature('layerLocking');
  const { LayerIcon } = getDefinitionForType(element.type);
  const { isSelected, handleClick } = useLayerSelection(element);
  const { isDefaultBackground } = element;
  const {
    duplicateElementsById,
    updateElementById,
    deleteElementById,
    currentPageBackgroundColor,
  } = useStory(({ actions, state }) => ({
    duplicateElementsById: actions.duplicateElementsById,
    deleteElementById: actions.deleteElementById,
    updateElementById: actions.updateElementById,
    currentPageBackgroundColor:
      !isDefaultBackground || state.currentPage?.backgroundColor,
  }));

  const { renamableLayer, setRenamableLayer } = useCanvas(
    ({ state, actions }) => ({
      renamableLayer: state.renamableLayer,
      setRenamableLayer: actions.setRenamableLayer,
    })
  );

  const { getProxiedUrl } = useCORSProxy();
  const layerRef = useRef(null);
  usePerformanceTracking({
    node: layerRef.current,
    eventData: { ...TRACKING_EVENTS.SELECT_ELEMENT, label: element.type },
  });

  const deleteButtonRef = useRef(null);
  usePerformanceTracking({
    node: deleteButtonRef.current,
    eventData: { ...TRACKING_EVENTS.DELETE_ELEMENT, label: element.type },
  });

  const layerId = `layer-${element.id}`;

  const lockTitle = element.isLocked
    ? __('Unlock Layer', 'web-stories')
    : __('Lock Layer', 'web-stories');

  const LockIcon = element.isLocked ? Icons.LockClosed : Icons.LockOpen;

  const handleChange = (evt) => {
    setNewLayerName(evt.target.value);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      setNewLayerName(layerName);
      setRenamableLayer(null);
    }
  };

  const updateLayerName = () => {
    setRenamableLayer(null);
    const trimmedLayerName = newLayerName.trim();
    // Don't update name if trimmed layer name is empty.
    // This means that submitting an empty name will exit renaming, and the
    // layer name will revert to whatever it was before, ignoring the empty input.
    if (!trimmedLayerName) {
      setNewLayerName(layerName);
    } else {
      updateElementById({
        elementId: element.id,
        properties: { layerName: trimmedLayerName },
      });
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    updateLayerName();
  };

  // We need to prevent the pointer-down event from propagating to the
  // reorderable when you click on the input. If not, the reorderable will
  // move focus, which will blur the input, which will cancel renaming.
  const stopPropagation = (evt) => evt.stopPropagation();

  const isLayerNamingEnabled = useFeature('layerNaming');
  const isRenameable = renamableLayer?.elementId === element.id;

  const layerGroupName = element.groupId
    ? `${__('Group', 'web-stories')} ${element.groupId.substr(-3)}: `
    : null;

  const isNested = element.groupId;

  return (
    <LayerContainer>
      {isRenameable && isLayerNamingEnabled ? (
        <LayerInputWrapper>
          <LayerIconWrapper>
            <LayerIcon
              element={element}
              getProxiedUrl={getProxiedUrl}
              currentPageBackgroundColor={currentPageBackgroundColor}
            />
          </LayerIconWrapper>
          <LayerInputForm onSubmit={handleSubmit}>
            <LayerInput
              tabIndex={-1}
              aria-label={__('Layer Name', 'web-stories')}
              value={newLayerName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={updateLayerName}
              onPointerDown={stopPropagation}
              hasFocus
            />
            <button hidden />
          </LayerInputForm>
        </LayerInputWrapper>
      ) : (
        <LayerButton
          ref={layerRef}
          id={layerId}
          onClick={handleClick}
          isSelected={isSelected}
          isNested={isNested}
        >
          <LayerIconWrapper>
            <LayerIcon
              element={element}
              getProxiedUrl={getProxiedUrl}
              currentPageBackgroundColor={currentPageBackgroundColor}
            />
          </LayerIconWrapper>
          <LayerDescription>
            <LayerContentContainer>
              <LayerText>{layerGroupName}</LayerText>
              <LayerText>{layerName}</LayerText>
            </LayerContentContainer>
            {element.isBackground && (
              <IconWrapper>
                <Icons.LockFilledClosed />
              </IconWrapper>
            )}
            {element.isLocked && isLayerLockingEnabled && (
              <IconWrapper aria-label={__('Locked', 'web-stories')}>
                <Icons.LockClosed />
              </IconWrapper>
            )}
          </LayerDescription>
        </LayerButton>
      )}
      {!element.isBackground && !isRenameable && (
        <ActionsContainer>
          <Tooltip title={__('Delete Layer', 'web-stories')} hasTail isDelayed>
            <LayerAction
              ref={deleteButtonRef}
              aria-label={__('Delete', 'web-stories')}
              aria-describedby={layerId}
              onPointerDown={preventReorder}
              onClick={() => deleteElementById({ elementId: element.id })}
            >
              <Icons.Trash />
            </LayerAction>
          </Tooltip>
          <Tooltip
            title={__('Duplicate Layer', 'web-stories')}
            hasTail
            isDelayed
          >
            <LayerAction
              aria-label={__('Duplicate', 'web-stories')}
              aria-describedby={layerId}
              onPointerDown={preventReorder}
              onClick={() =>
                duplicateElementsById({ elementIds: [element.id] })
              }
            >
              <Icons.PagePlus />
            </LayerAction>
          </Tooltip>
          {isLayerLockingEnabled && (
            <Tooltip title={lockTitle} hasTail isDelayed>
              <LayerAction
                aria-label={__('Lock/Unlock', 'web-stories')}
                aria-describedby={layerId}
                onPointerDown={preventReorder}
                onClick={() =>
                  updateElementById({
                    elementId: element.id,
                    properties: { isLocked: !element.isLocked },
                  })
                }
              >
                <LockIcon />
              </LayerAction>
            </Tooltip>
          )}
        </ActionsContainer>
      )}
    </LayerContainer>
  );
}

Layer.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default memo(Layer);
