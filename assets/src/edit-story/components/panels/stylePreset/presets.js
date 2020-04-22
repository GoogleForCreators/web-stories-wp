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
import { ReactComponent as Remove } from '../../../icons/remove.svg';
import { BACKGROUND_TEXT_MODE } from '../../../constants';
import generatePatternStyles from '../../../utils/generatePatternStyles';
import { PanelContent } from '../panel';
import PresetGroup from './presetGroup';
import { generatePresetStyle } from './utils';

const REMOVE_ICON_SIZE = 18;

const presetCSS = css`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border-color: transparent;
  padding: 0;
  font-size: 13px;
  position: relative;
  svg {
    width: ${REMOVE_ICON_SIZE}px;
    height: ${REMOVE_ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    left: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
  }
`;

const Color = styled.button`
  ${presetCSS}
  ${({ color }) => generatePatternStyles(color)}
`;

const Style = styled.button`
  ${presetCSS}
  background: transparent;
  ${({ styles }) => styles}
  width: 72px;
  border-radius: 4px;
`;

const TextWrapper = styled.span`
  text-align: left;
  line-height: 1.3;
`;

const HighLight = styled.span`
  padding: 0 2px;
  ${({ background }) => generatePatternStyles(background)}
  box-decoration-break: clone;
`;

function Presets({
  stylePresets,
  getEventHandlers,
  isEditMode,
  isText,
  textContent = 'Text',
}) {
  const { fillColors, textColors, textStyles } = stylePresets;

  const getStylePresetText = (preset) => {
    const isHighLight =
      preset.backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;
    // @todo Confirm text content usage.
    const text = textContent.substring(0, 8) + '...';
    return (
      <TextWrapper>
        {isHighLight ? (
          <HighLight background={preset.backgroundColor}>{text}</HighLight>
        ) : (
          text
        )}
      </TextWrapper>
    );
  };

  const colorPresets = isText ? textColors : fillColors;
  const hasColorPresets = colorPresets.length > 0;

  const colorPresetRenderer = (color, i, activeIndex) => {
    return (
      <Color
        tabIndex={activeIndex === i ? 0 : -1}
        color={color}
        {...getEventHandlers(color)}
        aria-label={
          isEditMode
            ? __('Delete color preset', 'web-stories')
            : __('Apply color preset', 'web-stories')
        }
      >
        {isEditMode && <Remove />}
      </Color>
    );
  };

  const stylePresetRenderer = (style, i, activeIndex) => {
    return (
      <Style
        tabIndex={activeIndex === i || (!activeIndex && i === 0) ? 0 : -1}
        styles={generatePresetStyle(style, true)}
        {...getEventHandlers(style)}
        aria-label={
          isEditMode
            ? __('Delete style preset', 'web-stories')
            : __('Apply style preset', 'web-stories')
        }
      >
        {getStylePresetText(style)}
        {isEditMode && <Remove />}
      </Style>
    );
  };

  const colorLabel = isText
    ? __('Text colors', 'web-stories')
    : __('Colors', 'web-stories');
  return (
    <PanelContent isPrimary padding={hasColorPresets ? null : '0'}>
      {hasColorPresets && (
        <PresetGroup
          label={colorLabel}
          itemRenderer={colorPresetRenderer}
          presets={colorPresets}
          type={'color'}
        />
      )}
      {/* Only texts support style presets currently */}
      {textStyles.length > 0 && isText && (
        <PresetGroup
          label={__('Styles', 'web-stories')}
          itemRenderer={stylePresetRenderer}
          presets={textStyles}
          type={'style'}
        />
      )}
    </PanelContent>
  );
}

Presets.propTypes = {
  stylePresets: PropTypes.shape({
    fillColors: PropTypes.array,
    textColors: PropTypes.array,
    textStyles: PropTypes.array,
  }).isRequired,
  getEventHandlers: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isText: PropTypes.bool.isRequired,
  textContent: PropTypes.string,
};

export default Presets;
