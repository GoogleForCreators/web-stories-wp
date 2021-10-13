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
import { __ } from '@web-stories-wp/i18n';
import { Button, BUTTON_TYPES, Icons } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../../types';
import { getDefinitionForType } from '../../../../elements';
import { useStory } from '../../../../app';
import { LayerText } from '../../../../elements/shared/layerText';
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

  --background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  background-color: var(--background-color);
  box-shadow: 0px 0px 15px 20px var(--background-color);
`;

const LayerContainer = styled.div`
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
  // Because the layer panel is aria-hidden, we need something else to select by
  'data-testid': 'layer-option',
})`
  position: relative;
  display: grid;
  grid-template-columns: 42px 1fr;

  border: 0;
  padding: 0;
  background: transparent;
  height: 100%;
  width: 100%;
  overflow: hidden;
  align-items: center;
  user-select: none;
  border-radius: 0;
  padding-left: 8px;
  transition: revert;

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      background: ${theme.colors.interactiveBg.secondaryPress};
      + * {
        --background-color: ${theme.colors.interactiveBg.secondaryPress};
      }
    `}

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryHover};
  }
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  :active {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryPress};
  }
  :active + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
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
  position: absolute;
  right: 0px;
  width: 32px;
  aspect-ratio: 1;

  /*
   * have to manually center this because this element is taller
   * than its parent causing flex to not properly center it.
   */
  top: 50%;
  transform: translateY(-50%);

  svg {
    display: block;
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
})`
  position: relative;
  aspect-ratio: 1;
  width: 20px;
  padding: 0;

  /*
   * all of our Icons right now have an embedded padding,
   * however the new designs just disregard this embedded
   * padding, so to accomodate, we'll make the icon its
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
   * override base button background color so we can recieve the 
   * proper background color from the parent.
   */
  && {
    transition: revert;
    background: var(--background-color);
  }

  /*
   * apply foreground color variants to children.
   */
  * {
    color: ${({ theme }) => theme.colors.fg.primary};
  }
  :disabled * {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

function Layer({ layer }) {
  const { LayerIcon, LayerContent } = getDefinitionForType(layer.type);
  const { isSelected, handleClick } = useLayerSelection(layer);
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));
  const isBackground = currentPage.elements[0].id === layer.id;

  return (
    <LayerContainer>
      <LayerButton
        id={`layer-${layer.id}`}
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
        {/*
         *@TODO #9137 #9138 add layer actions here. only reason we conditionally
         * render right now is to maintain visual continuity until
         * the actual actions are present.
         */}
        {isBackground && (
          <LayerAction disabled>
            <Icons.LockClosed />
          </LayerAction>
        )}
      </ActionsContainer>
    </LayerContainer>
  );
}

Layer.propTypes = {
  layer: StoryPropTypes.layer.isRequired,
};

export default Layer;
