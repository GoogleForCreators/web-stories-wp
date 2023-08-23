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
  updateOnChange,
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

      if (!revertToOriginal.current && newValue !== null) {
        const parsedValue = parseInput(currentValue, options);

        if (parsedValue !== null) {
          newValue = parsedValue;
        }
      } else if (currentValue !== null) {
        newValue = parseInput(currentValue, options);
      }

      revertToOriginal.current = false;
      if (newValue !== null) {
        // Set newly updated value.
        setCurrentValue(newValue);
        if (newValue !== oldValue.current) {
          onChange(ev, newValue);
        }
      } else if (min !== undefined) {
        // When new value is null and min is defined, set it to min value.
        setCurrentValue(min);
        onChange(ev, min);
      } else if (!allowEmpty) {
        // When above condition do not meet and empty values are not allowed, set value to `0`.
        // TODO (@AnuragVasanwala): Improve this logic by considering min and max boundary.
        setCurrentValue('0');
        onChange(ev, '0');
      } else {
        // When none of the above condition met, set empty value.
        setCurrentValue('');
        onChange(ev, '');
      }
    },
    [currentValue, onChange, options]
  );

  /**
   * Set internal state
   */
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const trimmedTargetValue = ev.target.value.trim();
      if (trimmedTargetValue === '') {
        setCurrentValue('');
        if (updateOnChange) {
          onChange(ev, '');
        }

        // Do not process further.
        return;
      } else if (!isNaN(Number(trimmedTargetValue))) {
        // Do not process non-numeric keys.
        // Return minimum number when string is empty.
        if (ev.target.value === '') {
          if (allowEmpty) {
            setCurrentValue('');
            if (updateOnChange) {
              onChange(ev, '');
            }

            // Do not process further.
            return;
          }
        }

        // Restricts inputted string to be <= max.
        const parsedValue = options.isFloat
          ? parseFloat(ev.target.value)
          : parseInt(ev.target.value);
        if (max !== undefined && parsedValue > max) {
          if (parsedValue > max) {
            setCurrentValue(
              trimmedTargetValue.charAt(trimmedTargetValue.length - 1)
            );
            if (updateOnChange) {
              onChange(
                ev,
                Number(
                  ev.target.value
                    .trim()
                    .charAt(trimmedTargetValue.length - 1)
                )
              );
            }
          }

          // Do not process further.
          return;
        }

        // Determine maximum padding according to the number of characters in max number.
        const maxPad = max !== undefined ? String(max).length : 0;
        const paddedValue =
          !ev.target.value.endsWith('.') && options.padZero
            ? String(parsedValue).padStart(maxPad, '0')
            : trimmedTargetValue;
        setCurrentValue(paddedValue);
        if (updateOnChange) {
          onChange(ev, Number(paddedValue));
        }
      } else if (trimmedTargetValue === '-') {
        setCurrentValue(trimmedTargetValue);
        if (updateOnChange) {
          onChange(ev, trimmedTargetValue);
        }
      }
    },
    [allowEmpty, max, onChange, options, updateOnChange]
  );

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

      setCurrentValue(newValue);
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
