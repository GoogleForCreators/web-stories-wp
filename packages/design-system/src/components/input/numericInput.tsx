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
import { forwardRef } from '@googleforcreators/react';
import type { ForwardedRef } from 'react';
/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import useNumericInput from './useNumericInput';
import Input from './input';
import type { NumericInputProps } from './types';

const NumericInput = forwardRef(function NumericInput(
  {
    allowEmpty,
    isFloat,
    onChange,
    max,
    min,
    value = '',
    isIndeterminate: originalIsIndeterminate,
    padZero,
    ...props
  }: NumericInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const {
    currentValue,
    handleBlur,
    handleChange,
    handleEsc,
    handleKeyUpAndDown,
    inputRef,
    isIndeterminate,
  } = useNumericInput({
    allowEmpty,
    isFloat,
    padZero,
    onChange,
    max,
    min,
    value,
    ref,
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

  // Holds filteredValue that may have leading padZero when required.
  let paddedValue = '';
  const maxPad = max !== undefined ? String(max).length : 0;
  if (maxPad >= String(currentValue).length) {
    // Add padding Zero when length is less than maxPad.
    paddedValue = padZero
      ? String(currentValue).padStart(maxPad, '0')
      : String(currentValue);
  } else {
    // Remove any leading Zero when maxPad is exceeded.
    paddedValue = String(currentValue).replace(/^0+/, '');
  }

  return (
    <Input
      ref={inputRef}
      onBlur={handleBlur}
      onChange={handleChange}
      value={paddedValue}
      isIndeterminate={isIndeterminate && originalIsIndeterminate}
      {...props}
    />
  );
});

export default NumericInput;
