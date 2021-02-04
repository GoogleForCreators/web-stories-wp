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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Lock as Locked } from '../../../../icons';
import StoryPropTypes from '../../../../types';
import { getDefinitionForType } from '../../../../elements';
import { useStory } from '../../../../app';
import useLayerSelection from './useLayerSelection';
import { LAYER_HEIGHT } from './constants';

const LayerButton = styled.button.attrs({
  type: 'button',
  tabIndex: -1,
  role: 'option',
  // Because the layer panel is aria-hidden, we need something else to select by
  'data-testid': 'layer-option',
})`
  display: flex;
  border: 0;
  padding: 0;
  background: transparent;
  height: ${LAYER_HEIGHT}px;
  width: 100%;
  overflow: hidden;
  align-items: center;
  user-select: none;

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      background: ${theme.colors.fg.gray24};
    `}

  &:active {
    outline: none;
  }
`;

const LayerIconWrapper = styled.div`
  width: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;

  svg {
    height: 28px;
    width: 28px;
    opacity: 0.5;
    color: ${({ theme }) => theme.colors.fg.white};
  }
`;

const LayerDescription = styled.div`
  width: calc(100% - 60px);
  display: flex;
  align-items: center;
  margin-left: 0;
  text-align: left;
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.description.family};
  font-size: ${({ theme }) => theme.fonts.description.size};
`;

const LockedIcon = styled(Locked)`
  height: 18px !important;
  width: 18px !important;
`;

const BackgroundDescription = styled.div`
  opacity: 0.5;
`;

const LayerContentContainer = styled.div`
  margin-right: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

function Layer({ layer }) {
  const { LayerIcon, LayerContent } = getDefinitionForType(layer.type);
  const { isSelected, handleClick } = useLayerSelection(layer);
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));
  const isBackground = currentPage.elements[0].id === layer.id;
  const showPreview = !isBackground || layer.type !== 'shape';

  return (
    <LayerButton
      id={`layer-${layer.id}`}
      isSelected={isSelected}
      onClick={handleClick}
    >
      <LayerIconWrapper>
        {isBackground ? (
          <LockedIcon aria-label={__('Background element', 'web-stories')} />
        ) : (
          <LayerIcon />
        )}
      </LayerIconWrapper>
      <LayerDescription>
        {showPreview && (
          <LayerContentContainer>
            <LayerContent element={layer} />
          </LayerContentContainer>
        )}
        {isBackground && (
          <BackgroundDescription>
            {__('Background (locked)', 'web-stories')}
          </BackgroundDescription>
        )}
      </LayerDescription>
    </LayerButton>
  );
}

Layer.propTypes = {
  layer: StoryPropTypes.layer.isRequired,
};

export default Layer;
