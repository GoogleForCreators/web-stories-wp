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
import { generatePresetStyle } from './utils';

const COLOR_HEIGHT = 35;

const presetCSS = css`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: 0.5px solid ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
  padding: 0;
  font-size: 13px;
  svg {
    width: 18px;
    height: 28px;
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

// For max-height: Display 5 extra pixels to show there are more colors.
const PresetGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: ${6 * COLOR_HEIGHT + 5}px;
  overflow-y: auto;
`;

const ButtonWrapper = styled.div`
  flex-basis: 16%;
  height: ${COLOR_HEIGHT}px;
`;

const PresetGroupLabel = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  padding: 6px 0;
`;

const HighLightWrapper = styled.p`
  margin: 0;
  ${({ background }) => generatePatternStyles(background)}
`;

function Presets({ stylePresets, getEventHandlers, isEditMode, isText }) {
  const { fillColors, textColors, styles } = stylePresets;

  const getStylePresetText = (preset) => {
    const isHighLight =
      preset.backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;
    const text = __('Text', 'web-stories');
    return isHighLight ? (
      <HighLightWrapper background={preset.backgroundColor}>
        {text}
      </HighLightWrapper>
    ) : (
      text
    );
  };

  const colorPresets = isText ? textColors : fillColors;
  const hasColorPresets = colorPresets.length > 0;

  const groupLabel = isText
    ? __('Text colors', 'web-stories')
    : __('Colors', 'web-stories');
  return (
    <PanelContent isPrimary padding={hasColorPresets ? null : '0'}>
      {hasColorPresets && (
        <>
          <PresetGroupLabel>{groupLabel}</PresetGroupLabel>
          <PresetGroup>
            {colorPresets.map((color, i) => (
              <ButtonWrapper key={`color-${i}`}>
                <Color
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
              </ButtonWrapper>
            ))}
          </PresetGroup>
        </>
      )}
      {styles.length > 0 && (
        <>
          <PresetGroupLabel>{__('Styles', 'web-stories')}</PresetGroupLabel>
          <PresetGroup>
            {styles.map((style, i) => (
              <ButtonWrapper key={`color-${i}`}>
                <Style
                  styles={generatePresetStyle(style, true)}
                  {...getEventHandlers(style)}
                  aria-label={
                    isEditMode
                      ? __('Delete style preset', 'web-stories')
                      : __('Apply style preset', 'web-stories')
                  }
                >
                  {isEditMode && <Remove />}
                  {!isEditMode && getStylePresetText(style)}
                </Style>
              </ButtonWrapper>
            ))}
          </PresetGroup>
        </>
      )}
    </PanelContent>
  );
}

Presets.propTypes = {
  stylePresets: PropTypes.shape({
    fillColors: PropTypes.array,
    textColors: PropTypes.array,
    styles: PropTypes.array,
  }).isRequired,
  getEventHandlers: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isText: PropTypes.bool.isRequired,
};

export default Presets;
