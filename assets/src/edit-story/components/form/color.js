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
import PropTypes from 'prop-types';
import { useRef, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../types';
import generatePatternCSS from '../../utils/generatePatternCSS';
import createSolid from '../../utils/createSolid';
import useColorPicker from '../inspector/colorPickerProvider/useColorPicker';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Box = styled.div`
  height: 32px;
  width: 122px;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.86)};
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
`;

const Preview = styled(Box).attrs({
  tabIndex: 0,
})`
  display: flex;
  width: 122px;
  cursor: pointer;

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.fg.v1};
    color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.55)};
  }
`;

const VisualPreview = styled.div`
  width: 32px;
  height: 32px;
`;

const TextualPreview = styled.div`
  padding-left: 10px;
  text-align: center;
`;

const OpacityPreview = styled(Box)`
  margin-left: 6px;
  width: 54px;
  line-height: 32px;
  text-align: center;
  cursor: ew-resize;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`;

const transparentStyle = {
  backgroundImage:
    'conic-gradient(#fff 0.25turn, #d3d4d4 0turn 0.5turn, #fff 0turn .75turn, #d3d4d4 0turn 1turn)',
  backgroundSize: '66.67% 66.67%',
};

function printRGB(r, g, b) {
  const hex = (v) => v.toString(16).padStart(2, '0');
  return `${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

function getPreviewStyle(pattern, defaultColor) {
  if (!pattern) {
    if (!defaultColor) {
      return transparentStyle;
    }
    return { backgroundColor: `#${defaultColor}` };
  }
  const isSolidPattern = pattern.type === 'solid' || !pattern.type;
  if (!isSolidPattern) {
    return generatePatternCSS(pattern);
  }
  const {
    color: { r, g, b, a },
  } = pattern;
  // If opacity is 0, create as transparent:
  if (a === 0) {
    return transparentStyle;
  }

  // Otherwise create color, but with full opacity
  return generatePatternCSS(createSolid(r, g, b));
}

function getPreviewOpacity(pattern, specifiedOpacity = 1) {
  if (!pattern) {
    return specifiedOpacity * 100;
  }
  const isSolidPattern = pattern.type === 'solid' || !pattern.type;
  if (!isSolidPattern) {
    return specifiedOpacity * 100;
  }
  const {
    color: { a = 1 },
  } = pattern;
  return a * 100;
}

function getPreviewText(pattern) {
  if (!pattern) {
    return null;
  }
  switch (pattern.type) {
    case 'radial':
      return __('Radial', 'web-stories');
    case 'conic':
      return __('Conic', 'web-stories');
    case 'linear':
      return __('Linear', 'web-stories');
    case 'solid':
    default:
      const {
        color: { r, g, b, a },
      } = pattern;
      if (a === 0) {
        return null;
      }
      return printRGB(r, g, b);
  }
}

function ColorInput({ onChange, isMultiple, opacity, value, label }) {
  const previewStyle = getPreviewStyle(isMultiple ? null : value);
  const previewText = getPreviewText(value);
  const previewOpacity = getPreviewOpacity(value, opacity);
  const fullLabel = `${label}: ${previewText}`;

  const {
    actions: { showColorPickerAt, hideColorPicker },
  } = useColorPicker();

  const ref = useRef();

  const handleOpenEditing = useCallback(() => {
    showColorPickerAt(ref.current, {
      color: value,
      onChange,
      onClose: hideColorPicker,
    });
  }, [showColorPickerAt, hideColorPicker, value, onChange]);

  return (
    <Container ref={ref}>
      <Preview onClick={handleOpenEditing} aria-label={fullLabel}>
        <VisualPreview style={previewStyle} />
        <TextualPreview>
          {isMultiple
            ? __('Multiple', 'web-stories')
            : previewText ||
              _x('None', 'No color or gradient selected', 'web-stories')}
        </TextualPreview>
      </Preview>
      <OpacityPreview isVisible={Boolean(previewText)}>
        {previewOpacity}
        {_x('%', 'Percentage', 'web-stories')}
      </OpacityPreview>
    </Container>
  );
}

ColorInput.propTypes = {
  value: PatternPropType,
  isMultiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  opacity: PropTypes.number,
  label: PropTypes.string,
};

ColorInput.defaultProps = {
  defaultColor: null,
  isMultiple: false,
  opacity: null,
  labelledBy: null,
};

export default ColorInput;
