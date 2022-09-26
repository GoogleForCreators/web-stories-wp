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
import PropTypes from 'prop-types';
import { forwardRef } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import { useNumericInput } from './useNumericInput';
import { Input, InputPropTypes } from '.';

export const NumericInput = forwardRef(function NumericInput(
  {
    allowEmpty,
    isFloat,
    onChange,
    max,
    min,
    value = '',
    isIndeterminate: originalIsIndeterminate,
    ...props
  },
  ref
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
    onChange,
    max,
    min,
    value,
    isIndeterminate: originalIsIndeterminate,
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

  return (
    <Input
      ref={inputRef}
      onBlur={handleBlur}
      onChange={handleChange}
      value={String(currentValue)}
      isIndeterminate={isIndeterminate && originalIsIndeterminate}
      {...props}
    />
  );
});
NumericInput.propTypes = {
  ...InputPropTypes,
  allowEmpty: PropTypes.bool,
  isFloat: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
