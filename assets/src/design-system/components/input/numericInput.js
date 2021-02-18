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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import { Input, InputPropTypes } from '.';

/**
 * @param {string|number} value The value to parse
 * @param {Object} options Object of options
 * @param {boolean} options.allowEmpty Allow value to be empty
 * @param {boolean} options.isFloat Allow value to be a float
 * @param {number|undefined} options.min Minimum allowed value
 * @param {number|undefined} options.max Maximum allowed value
 * @return {string|number|null} The formatted value or `null` if the value cannot be parsed
 */
export function parseInput(value, { allowEmpty, isFloat, min, max }) {
  if (`${value}`.length > 0) {
    const valueAsNumber = isFloat ? parseFloat(value) : parseInt(value);

    let boundedValue = valueAsNumber;
    if (min !== undefined) {
      boundedValue = Math.max(min, valueAsNumber);
    }
    if (max !== undefined) {
      boundedValue = Math.min(max, valueAsNumber);
    }

    return !isNaN(boundedValue) ? boundedValue : null;
  } else if (allowEmpty) {
    return '';
  }

  return null;
}

/**
 * @param {string|number} value The value to validate
 * @param {Object} options Object of options
 * @param {boolean} options.allowEmpty Allow value to be empty
 * @param {boolean} options.isFloat Allow value to be a float
 * @param {number|undefined} options.min Minimum allowed value
 * @param {number|undefined} options.max Maximum allowed value
 * @return {boolean} the value's validity when tested against the options
 */
export function isInputValid(value, { allowEmpty, isFloat, max, min }) {
  if (allowEmpty && `${value}`.length === 0) {
    return true;
  }

  const valueAsANumber = isFloat ? parseFloat(value) : parseInt(value);

  if (min !== undefined && valueAsANumber < min) {
    return false;
  }
  if (max !== undefined && valueAsANumber > max) {
    return false;
  }

  return !isNaN(valueAsANumber);
}

export const useNumericInput = ({
  allowEmpty,
  isFloat,
  max,
  min,
  onChange,
  value,
}) => {
  const inputRef = useRef(null);
  const oldValue = useRef(value);
  const revertToOriginal = useRef(false);
  const [currentValue, setCurrentValue] = useState(value);
  const options = useMemo(() => ({ allowEmpty, isFloat, max, min }), [
    allowEmpty,
    isFloat,
    max,
    min,
  ]);

  /**
   * Call external `onChange`
   */
  const handleBlur = useCallback(
    (ev) => {
      let newValue = oldValue.current;

      if (!revertToOriginal.current && isInputValid(currentValue, options)) {
        newValue = parseInput(currentValue, options);
      }

      revertToOriginal.current = false;

      setCurrentValue(newValue);
      onChange(ev, newValue);
    },
    [currentValue, onChange, options]
  );

  /**
   * Set internal state
   */
  const handleChange = useCallback((ev) => {
    setCurrentValue(ev.target.value);
  }, []);

  /**
   * Increment or decrement value using keyboard input
   */
  const handleKeyUpAndDown = useCallback(
    (ev) => {
      const { altKey, key } = ev;
      const isCurrentValueValid = isInputValid(currentValue, options);

      let newValue = isCurrentValueValid
        ? parseInput(currentValue, options)
        : 0;
      const diff = Big(options.isFloat && altKey ? 0.1 : 1);

      if (key === 'ArrowUp') {
        // Increment
        newValue =
          typeof max !== 'undefined'
            ? Math.min(max, Big(newValue).plus(diff))
            : Big(newValue).plus(diff);
      } else if (key === 'ArrowDown') {
        // Decrement
        newValue =
          typeof min !== 'undefined'
            ? Math.max(min, Big(newValue).minus(diff))
            : Big(newValue).minus(diff);
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
    inputRef && inputRef.current?.blur();
  }, []);

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
  };
};

export const NumericInput = ({
  allowEmpty,
  isFloat,
  onChange,
  max,
  min,
  value,
  ...props
}) => {
  const {
    currentValue,
    handleBlur,
    handleChange,
    handleEsc,
    handleKeyUpAndDown,
    inputRef,
  } = useNumericInput({
    allowEmpty,
    isFloat,
    onChange,
    max,
    min,
    value,
  });

  useKeyDownEffect(
    inputRef,
    {
      key: ['up', 'alt+up', 'down', 'alt+down'],
      editable: true,
    },
    handleKeyUpAndDown,
    [handleKeyUpAndDown]
  );

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
    handleBlur,
    [handleBlur]
  );

  return (
    <Input
      ref={inputRef}
      onBlur={handleBlur}
      onChange={handleChange}
      value={String(currentValue)}
      {...props}
    />
  );
};
NumericInput.propTypes = {
  ...InputPropTypes,
  allowEmpty: PropTypes.bool,
  isFloat: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
