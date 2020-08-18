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
import { useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Remove } from '../../../icons';
import generatePatternStyles from '../../../utils/generatePatternStyles';
import { PanelContent } from '../panel';
import { StylePresetPropType } from '../../../types';
import WithTooltip from '../../tooltip';
import { useKeyDownEffect } from '../../keyboard';
import PresetGroup from './presetGroup';
import { presetHasOpacity, presetHasGradient } from './utils';

const REMOVE_ICON_SIZE = 18;
const PRESET_SIZE = 30;

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
    border-color: ${({ theme }) => theme.colors.fg.v1};
    border-width: 3px;
  }
`;

const ColorButton = styled.button.attrs({ type: 'button' })`
  ${presetCSS}
  ${({ color }) => generatePatternStyles(color)}

  &:focus {
    outline: none !important;
  }
`;

function Color({ onClick, children, ...rest }) {
  // We unfortunately have to manually assign this listener, as it would be default behaviour
  // if it wasn't for our listener further up the stack interpreting enter as "enter edit mode"
  // for text elements. For non-text element selection, this does nothing, that default beviour
  // wouldn't do.
  const ref = useRef();
  useKeyDownEffect(ref, 'enter', onClick, [onClick]);
  return (
    <ColorButton ref={ref} onClick={onClick} {...rest}>
      {children}
    </ColorButton>
  );
}

Color.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

function Presets({
  stylePresets,
  handleOnClick,
  isEditMode,
  isText,
  isBackground,
}) {
  const { colors } = stylePresets;

  const hasPresets = colors.length > 0;

  const colorPresetRenderer = (color, i, activeIndex) => {
    if (!color) {
      return null;
    }
    const disabled =
      !isEditMode &&
      ((isBackground && presetHasOpacity(color)) ||
        (isText && presetHasGradient(color)));
    let tooltip = null;
    if (disabled) {
      // @todo The correct text here should be: Page background colors can not have an opacity.
      // However, due to bug with Tooltips/Popup, the text flows out of the screen.
      tooltip = isBackground
        ? __('Opacity not allowed for Page', 'web-stories')
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
    <PanelContent isPrimary padding={hasPresets ? null : '0'}>
      {hasPresets && (
        <PresetGroup
          itemRenderer={colorPresetRenderer}
          presets={colors}
          type={'color'}
        />
      )}
    </PanelContent>
  );
}

Presets.propTypes = {
  stylePresets: StylePresetPropType.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isText: PropTypes.bool.isRequired,
  isBackground: PropTypes.bool.isRequired,
};

export default Presets;
