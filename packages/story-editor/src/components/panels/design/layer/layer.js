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
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_TYPES,
  Icons,
  themeHelpers,
  Tooltip,
} from '@web-stories-wp/design-system';
import { useRef } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../../types';
import { getDefinitionForType } from '../../../../elements';
import { useStory } from '../../../../app';
import { LayerText } from '../../../../elements/shared/layerText';
import usePerformanceTracking from '../../../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../../../constants/performanceTrackingEvents';
import useLayerSelection from './useLayerSelection';
import { LAYER_HEIGHT } from './constants';

const ActionsContainer = styled.div`
  position: absolute;
  display: none;
  align-items: center;
  height: 100%;
  top: 0;
  right: 0;
  padding-right: 6px;
  column-gap: 6px;

  --background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  --background-color-opaque: ${({ theme }) =>
    rgba(theme.colors.interactiveBg.secondaryNormal, 0)};
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

const LayerContainer = styled.div.attrs({
  // Because the layer panel is aria-hidden, we need something else to select by
  'data-testid': 'layer-option',
})`
  position: relative;
  height: ${LAYER_HEIGHT}px;
  width: 100%;
  overflow: hidden;

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
  padding-left: 12px;
  transition: revert;

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      background: ${theme.colors.interactiveBg.secondaryPress};
      + * {
        --background-color: ${theme.colors.interactiveBg.secondaryPress};
        --background-color-opaque: ${rgba(
          theme.colors.interactiveBg.secondaryPress,
          0
        )};
        --selected-hover-color: ${theme.colors.interactiveBg.tertiaryHover};
      }
    `}

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryHover};
  }
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.secondaryHover, 0)};
  }

  :active {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryPress};
  }
  :active + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.secondaryPress, 0)};
  }

      background: ${theme.colors.interactiveBg.secondaryPress};
      + * {
        --background-color: ${theme.colors.interactiveBg.secondaryPress};
        --background-color-opaque: ${rgba(
          theme.colors.interactiveBg.secondaryPress,
          0
        )};
        --selected-hover-color: ${theme.colors.interactiveBg.tertiaryHover};
      }
    `}

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryHover};
  }
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.secondaryHover, 0)};
  }

  :active {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryPress};
  }
  :active + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.secondaryPress, 0)};
  }
`;

const LayerIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.colors.fg.primary};
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  right: 0;
  width: 32px;
  aspect-ratio: 1;

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

function Layer({ layer }) {
  const { LayerIcon, LayerContent } = getDefinitionForType(layer.type);
  const { isSelected, handleClick } = useLayerSelection(layer);
  const { currentPage, deleteElementById, duplicateElementById } = useStory(
    (state) => ({
      currentPage: state.state.currentPage,
      deleteElementById: state.actions.deleteElementById,
      duplicateElementById: state.actions.duplicateElementById,
    })
  );

  const layerRef = useRef(null);
  usePerformanceTracking({
    node: layerRef.current,
    eventData: { ...TRACKING_EVENTS.SELECT_ELEMENT, label: layer.type },
  });

  const deleteButtonRef = useRef(null);
  usePerformanceTracking({
    node: deleteButtonRef.current,
    eventData: { ...TRACKING_EVENTS.DELETE_ELEMENT, label: layer.type },
  });

  const isBackground = currentPage.elements[0].id === layer.id;
  const layerId = `layer-${layer.id}`;

  return (
    <LayerContainer>
      <LayerButton
        ref={layerRef}
        id={layerId}
        onClick={handleClick}
        isSelected={isSelected}
      >
        <LayerIconWrapper>
          <LayerIcon element={layer} currentPage={currentPage} />
        </LayerIconWrapper>
        <LayerDescription>
          <LayerContentContainer>
            {isBackground ? (
              <LayerText>{__('Background', 'web-stories')}</LayerText>
            ) : (
              <LayerContent element={layer} />
            )}
          </LayerContentContainer>
          {isBackground && (
            <IconWrapper>
              <Icons.LockClosed />
            </IconWrapper>
          )}
        </LayerDescription>
      </LayerButton>
      <ActionsContainer>
        {isBackground ? (
          <LayerAction
            aria-label={__('Locked', 'web-stories')}
            aria-describedby={layerId}
            disabled
          >
            <Icons.LockClosed />
          </LayerAction>
        ) : (
          <>
            <Tooltip
              title={__('Delete Layer', 'web-stories')}
              hasTail
              isDelayed
            >
              <LayerAction
                ref={deleteButtonRef}
                aria-label={__('Delete', 'web-stories')}
                aria-describedby={layerId}
                onPointerDown={preventReorder}
                onClick={() => deleteElementById({ elementId: layer.id })}
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
                onClick={() => duplicateElementById({ elementId: layer.id })}
              >
                <Icons.PagePlus />
              </LayerAction>
            </Tooltip>
          </>
        )}
      </ActionsContainer>
    </LayerContainer>
  );
}

Layer.propTypes = {
  layer: StoryPropTypes.layer.isRequired,
};

export default Layer;
