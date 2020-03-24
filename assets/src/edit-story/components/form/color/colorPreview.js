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
import PropTypes from 'prop-types';
import { useRef, useCallback, useEffect, useState } from 'react';
import { parseToRgb } from 'polished';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../../types';
import { useSidebar } from '../../sidebar';
import MULTIPLE_VALUE from '../multipleValue';
import getPreviewText from './getPreviewText';
import getPreviewStyle from './getPreviewStyle';
import ColorBox from './colorBox';

const Preview = styled(ColorBox)`
  display: flex;
  width: 122px;
  padding: 0;
  border: 0;
  cursor: pointer;
`;

const VisualPreview = styled.div.attrs(({ isEditable }) => ({
  as: isEditable ? 'button' : 'div',
}))`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 0;
  padding: 0;
  background: transparent;
`;

const TextualPreview = styled.div`
  padding: 0 0 0 10px;
  text-align: left;
  flex-grow: 1;
  font-size: 15px;
  line-height: 32px;
  height: 32px;
`;

const TextualInput = styled(TextualPreview).attrs({ as: 'input' })`
  background: transparent;
  color: inherit;
  border: 0;
  margin: 0;
  cursor: text;
`;

function ColorPreview({ onChange, hasGradient, hasOpacity, value, label }) {
  const isMultiple = value === MULTIPLE_VALUE;
  value = isMultiple ? '' : value;
  const previewStyle = getPreviewStyle(value);
  const previewText = getPreviewText(value);

  const {
    actions: { showColorPickerAt, hideSidebar },
  } = useSidebar();

  const ref = useRef();

  const handleOpenEditing = useCallback(() => {
    showColorPickerAt(ref.current, {
      color: isMultiple ? null : value,
      onChange,
      hasGradient,
      hasOpacity,
      onClose: hideSidebar,
    });
  }, [
    showColorPickerAt,
    hideSidebar,
    isMultiple,
    value,
    onChange,
    hasGradient,
    hasOpacity,
  ]);

  const [hexInputValue, setHexInputValue] = useState('');

  useEffect(() => setHexInputValue(previewText), [previewText]);

  const isEditable = !value.type || value.type === 'solid';

  const buttonProps = {
    as: 'button',
    type: 'button', // avoid submitting forms
    onClick: handleOpenEditing,
    'aria-label': label,
  };

  const handleInputChange = useCallback(
    (evt) => {
      const raw = evt.target.value;
      // Strip initial '#' (might very well be pasted in)
      const val = raw.charAt(0) === '#' ? raw.substr(1) : raw;
      setHexInputValue(val);
      const hasNonHex = /[^0-9a-f]/i.test(val);
      const hasValidLength = val.length === 6;
      if (hasNonHex || !hasValidLength) {
        // Invalid color hex, just allow it for now
        // but don't pass it upstream
        return;
      }

      // Update actual color, which will in turn update hex input from value
      const { red: r, green: g, blue: b } = parseToRgb(`#${val}`);
      // Keep same opacity as before though
      const {
        color: { a },
      } = value;
      onChange({ color: { r, g, b, a } });
    },
    [value, onChange]
  );

  // Reset to last known "valid" color on blur
  const handleInputBlur = useCallback(() => setHexInputValue(previewText), [
    previewText,
  ]);

  // Always hide color picker on unmount - note the double arrows
  useEffect(() => () => hideSidebar(), [hideSidebar]);

  if (isEditable) {
    // If editable, only the visual preview component is a button
    // And the text is an input field
    return (
      <Preview ref={ref}>
        <VisualPreview role="status" style={previewStyle} {...buttonProps} />
        <TextualInput
          aria-label={label}
          value={hexInputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      </Preview>
    );
  }

  // If not editable, the whole component is a button
  return (
    <Preview ref={ref} {...buttonProps}>
      <VisualPreview role="status" style={previewStyle} />
      <TextualPreview>
        {isMultiple
          ? __('Multiple', 'web-stories')
          : previewText ||
            _x('None', 'No color or gradient selected', 'web-stories')}
      </TextualPreview>
    </Preview>
  );
}

ColorPreview.propTypes = {
  value: PatternPropType,
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

ColorPreview.defaultProps = {
  hasGradient: false,
  hasOpacity: true,
  label: null,
};

export default ColorPreview;
