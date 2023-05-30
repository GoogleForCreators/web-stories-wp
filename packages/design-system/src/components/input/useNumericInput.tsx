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
import Big from 'big.js';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import type { ChangeEvent } from 'react';

/**
 * Internal dependencies
 */
import { isInputValid, parseInput } from './validation';
import type { UseNumericInputProps } from './types';

const useNumericInput = ({
  allowEmpty,
  isFloat,
  padZero,
  max,
  min,
  onChange,
  value,
  ref,
}: UseNumericInputProps) => {
  const _inputRef = useRef<HTMLInputElement>(null);
  const inputRef = ref && 'current' in ref ? ref : _inputRef;
  const oldValue = useRef(value);
  const revertToOriginal = useRef(false);
  const [currentValue, setCurrentValue] = useState(value);
  const options = useMemo(
    () => ({ allowEmpty, isFloat, padZero, max, min }),
    [allowEmpty, isFloat, padZero, max, min]
  );

  /**
   * Call external `onChange`
   */
  const handleBlur = useCallback(
    (ev: unknown) => {
      let newValue = parseInput(oldValue.current, options);

      if (!revertToOriginal.current) {
        const parsedValue = parseInput(currentValue, options);

        if (parsedValue !== null) {
          newValue = parsedValue;
        }
      }

      revertToOriginal.current = false;
      if (newValue !== null) {
        setCurrentValue(newValue);
        if (newValue !== oldValue.current) {
          onChange(ev, newValue);
        }
      }
    },
    [currentValue, onChange, options]
  );

  /**
   * Set internal state
   */
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    // Do not process non-numeric keys.
    if (!isNaN(+ev.target.value.trim())) {
      // Return minimum number when string is empty.
      if (ev.target.value === '') {
        setCurrentValue(min);
        onChange(ev, Number(min));

        // Do not process further.
        return;
      }

      // Restricts inputted string to be between min and max.
      let parsedValue = (options.isFloat) ? parseFloat(ev.target.value) : parseInt(ev.target.value);
      if (min !== undefined && max !== undefined && (parsedValue < min || parsedValue > max)) {
        if (parsedValue < min) {
          setCurrentValue(min);
          onChange(ev, Number(min));
        } else if (parsedValue > max) {
          setCurrentValue(ev.target.value.trim().charAt(ev.target.value.trim().length - 1));
          onChange(ev, Number(ev.target.value.trim().charAt(ev.target.value.trim().length - 1)));
        }

        // Do not process further.
        return;
      }

      // Determine maximum padding according to the number of characters in max number. 
      const maxPad = (max !== undefined) ? String(max).length : 0;
      const paddedValue = (!ev.target.value.endsWith('.') && options.padZero) ? String(parsedValue).padStart(maxPad, '0') : ev.target.value.trim();
      setCurrentValue(paddedValue);
      onChange(ev, Number(paddedValue));
    }
  }, [options, onChange]);

  /**
   * Increment or decrement value using keyboard input
   */
  const handleKeyUpAndDown = useCallback(
    (ev: KeyboardEvent) => {
      const { altKey, key } = ev;
      const isCurrentValueValid = isInputValid(currentValue, options);

      let newValue = isCurrentValueValid
        ? parseInput(currentValue, options)
        : 0;
      newValue = newValue === null ? '' : newValue;
      const diff = Big(options.isFloat && altKey ? 0.1 : 1);

      if (key === 'ArrowUp') {
        // Increment
        newValue =
          typeof max !== 'undefined'
            ? Math.min(max, Big(newValue).plus(diff).toNumber())
            : Big(newValue).plus(diff).toNumber();
      } else if (key === 'ArrowDown') {
        // Decrement
        newValue =
          typeof min !== 'undefined'
            ? Math.max(min, Big(newValue).minus(diff).toNumber())
            : Big(newValue).minus(diff).toNumber();
      }

      onChange(ev, Number(newValue));
    },
    [currentValue, max, min, onChange, options]
  );

  /**
   * Blur input and revert value to original value
   */
  const handleEsc = useCallback(() => {
    setCurrentValue(oldValue.current);
    revertToOriginal.current = true;
    inputRef?.current?.blur();
  }, [inputRef]);

  useEffect(() => {
    // update internal value when `value` prop changes
    oldValue.current = value;
    setCurrentValue(value);
  }, [value]);

  return {
    // state
    currentValue,
    inputRef,
    // event handlers
    handleBlur,
    handleChange,
    handleEsc,
    handleKeyUpAndDown,
    isIndeterminate: oldValue.current === currentValue,
  };
};

export default useNumericInput;
