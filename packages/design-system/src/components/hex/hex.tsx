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
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from '@googleforcreators/react';
import { parseToRgb } from 'polished';
import { getHexFromValue, getPreviewText } from '@googleforcreators/patterns';
import type { Solid } from '@googleforcreators/patterns';
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ForwardedRef,
} from 'react';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import { Input } from '../input';

interface HexProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange'> {
  value: Solid;
  onChange: (color: Solid) => void;
}

const HexInput = forwardRef(function Hex(
  { value, placeholder, onChange, ...rest }: HexProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [inputValue, setInputValue] = useState<string | null>(null);

  const inputRef = useRef(null);
  const skipValidationRef = useRef(false);

  const previewText = getPreviewText(value);
  useEffect(() => setInputValue(previewText), [previewText]);

  const handleInputChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      // Trim and strip initial '#' (might very well be pasted in)
      const val = evt.target.value.trim().replace(/^#/, '');
      setInputValue(val);
    },
    []
  );

  const validateAndSubmitInput = useCallback(() => {
    const hex = getHexFromValue(String(inputValue)) ?? previewText;
    setInputValue(hex);

    // Only trigger onChange when hex has been changed
    if (hex !== previewText) {
      // Update actual color, which will in turn update hex input from value
      const { red: r, green: g, blue: b } = parseToRgb(`#${String(hex)}`);

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
    const availableRef = ref && 'current' in ref ? ref : inputRef;
    availableRef.current?.blur();
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

export default HexInput;
