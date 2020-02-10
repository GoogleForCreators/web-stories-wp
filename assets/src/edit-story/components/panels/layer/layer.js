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
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import { getDefinitionForType } from '../../../elements';
import useLayerSelection from './useLayerSelection';
import { LAYER_HEIGHT } from './constants';

const LayerButton = styled.button.attrs({
  type: 'button',
  tabIndex: '0',
  role: 'option',
})`
  display: flex;
  border: 0;
  padding: 0;
  background: transparent;
  height: ${LAYER_HEIGHT}px;
  width: 100%;
  overflow: hidden;
  align-items: center;

  ${({ isSelected, theme }) =>
    isSelected &&
    `
    background: ${rgba(theme.colors.action, 0.14)};
  `}

  &:focus,
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
    color: ${({ theme }) => theme.colors.bg.v0};
  }
`;

const LayerDescription = styled.div`
  width: calc(100% - 60px);
  display: flex;
  align-items: center;
  margin-left: 0;
  text-align: left;
`;

function Layer({ element }) {
  const { LayerIcon, LayerContent } = getDefinitionForType(element.type);
  const id = `layer-${element.id}`;

  const { isSelected, handleClick } = useLayerSelection(element);

  return (
    <LayerButton
      isSelected={isSelected}
      onClick={handleClick}
      aria-labelledby={id}
    >
      <LayerIconWrapper>
        <LayerIcon />
      </LayerIconWrapper>
      <LayerDescription id={id}>
        <LayerContent element={element} />
      </LayerDescription>
    </LayerButton>
  );
}

Layer.propTypes = {
  element: StoryPropTypes.layer.isRequired,
};

export default Layer;
