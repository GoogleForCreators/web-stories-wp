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
    () => ({ allowEmpty, isFloat, max, min }),
    [allowEmpty, isFloat, max, min]
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
    setCurrentValue(ev.target.value);
  }, []);

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
