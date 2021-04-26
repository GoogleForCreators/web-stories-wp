/*
 * Copyright 2021 Google LLC
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
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { parseToRgb } from 'polished';
import { useKeyDownEffect } from '../keyboard';
import { InputPropTypes, Input } from '../input';
import getHexFromValue from './getHexFromValue';
import getPreviewText from './getPreviewText';

export const HexInput = forwardRef(function Hex(
  { value, placeholder, onChange, ...rest },
  ref
) {
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef(null);
  const skipValidationRef = useRef(false);

  const previewText = getPreviewText(value);
  useEffect(() => setInputValue(previewText), [previewText]);

  const handleInputChange = useCallback((evt) => {
    // Trim and strip initial '#' (might very well be pasted in)
    const val = evt.target.value.trim().replace(/^#/, '');
    setInputValue(val);
  }, []);

  const validateAndSubmitInput = useCallback(() => {
    const hex = getHexFromValue(inputValue) ?? previewText;
    setInputValue(hex);

    // Only trigger onChange when hex has been changed
    if (hex !== previewText) {
      // Update actual color, which will in turn update hex input from value
      const { red: r, green: g, blue: b } = parseToRgb(`#${hex}`);

      // Keep same opacity as before though. In case of mixed values, set to default (1).
      const a = value.color.a;
      onChange({ color: { r, g, b, a } });
    }
  }, [inputValue, previewText, onChange, value]);

  const handleEnter = useCallback(() => {
    validateAndSubmitInput();
  }, [validateAndSubmitInput]);

  const handleInputBlur = useCallback(() => {
    if (!skipValidationRef.current) {
      validateAndSubmitInput();
    }

    // Reset flag after use
    skipValidationRef.current = false;
  }, [validateAndSubmitInput]);

  const handleEsc = useCallback(() => {
    // Revert input value and exit input focus without
    // triggering blur validation
    setInputValue(previewText);
    skipValidationRef.current = true;
    const availableRef = ref?.current ? ref : inputRef;
    availableRef.current.blur();
  }, [previewText, ref]);

  useKeyDownEffect(
    inputRef,
    {
      key: ['escape'],
      editable: true,
    },
    handleEsc,
    [handleEsc]
  );

  useKeyDownEffect(
    inputRef,
    {
      key: ['enter'],
      editable: true,
    },
    handleEnter,
    [handleEnter]
  );

  return (
    <Input
      ref={ref || inputRef}
      value={inputValue || ''}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      placeholder={placeholder}
      {...rest}
    />
  );
});

HexInput.propTypes = {
  ...InputPropTypes,
  value: PropTypes.object,
};
