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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import WithTooltip from '../../../../tooltip';
import { Remove } from '../../../../../icons';
import { useStory } from '../../../../../app/story';
import generatePatternStyles from '../../../../../utils/generatePatternStyles';
import PresetPanel from '../presetPanel';
import { areAllType, presetHasGradient, presetHasOpacity } from '../utils';

const PRESET_SIZE = 30;
const REMOVE_ICON_SIZE = 18;

const Transparent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: conic-gradient(
    #fff 0.25turn,
    #d3d4d4 0turn 0.5turn,
    #fff 0turn 0.75turn,
    #d3d4d4 0turn 1turn
  );
  background-size: 50% 50%;
`;

const ColorWrapper = styled.div`
  display: block;
  width: ${PRESET_SIZE}px;
  height: ${PRESET_SIZE}px;
  border: 1px solid ${({ theme }) => theme.colors.whiteout};
  border-radius: 100%;
  overflow: hidden;
  position: relative;
  ${({ disabled }) => (disabled ? 'opacity: 0.4;' : '')}

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.fg.white};
    border-width: 3px;
  }
`;

const presetCSS = css`
  display: block;
  width: 100%;
  height: 100%;
  font-size: 13px;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  border-color: transparent;
  border-width: 0;
  svg {
    width: ${REMOVE_ICON_SIZE}px;
    height: ${REMOVE_ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    left: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
  }
`;
const Color = styled.button.attrs({ type: 'button' })`
  ${presetCSS}
  ${({ color }) => generatePatternStyles(color)}

  &:focus {
    outline: none !important;
  }
`;

function ColorPresetPanel({ pushUpdate }) {
  const { currentPage, selectedElements } = useStory(
    ({ state: { currentPage, selectedElements } }) => {
      return {
        currentPage,
        selectedElements,
      };
    }
  );

  const isText = areAllType('text', selectedElements);
  const isBackground = selectedElements[0].id === currentPage.elements[0].id;
  const colorPresetRenderer = (
    color,
    i,
    activeIndex,
    handleOnClick,
    isEditMode
  ) => {
    if (!color) {
      return null;
    }
    const disabled =
      !isEditMode &&
      ((isBackground && presetHasOpacity(color)) ||
        (isText && presetHasGradient(color)));
    let tooltip = null;
    if (disabled) {
      tooltip = isBackground
        ? __('Page background colors cannot have an opacity.', 'web-stories')
        : __('Gradient not allowed for Text', 'web-stories');
    }
    return (
      <WithTooltip title={tooltip}>
        <ColorWrapper disabled={disabled}>
          <Transparent />
          <Color
            tabIndex={activeIndex === i ? 0 : -1}
            color={color}
            onClick={() => handleOnClick(color)}
            disabled={disabled}
            aria-label={
              isEditMode
                ? __('Delete color preset', 'web-stories')
                : __('Apply color preset', 'web-stories')
            }
          >
            {isEditMode && <Remove />}
          </Color>
        </ColorWrapper>
      </WithTooltip>
    );
  };

  return (
    <PresetPanel
      title={__('Saved colors', 'web-stories')}
      itemRenderer={colorPresetRenderer}
      pushUpdate={pushUpdate}
    />
  );
}

ColorPresetPanel.propTypes = {
  pushUpdate: PropTypes.func.isRequired,
};

export default ColorPresetPanel;
