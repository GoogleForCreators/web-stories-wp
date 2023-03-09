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
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';

export type InputValue = string | number;
export interface ParseInputProps {
  allowEmpty: boolean;
  isFloat: boolean;
  min?: number;
  max?: number;
}

export interface AbstractNumericInputProps extends ParseInputProps {
  onChange: (evt: unknown, val: InputValue) => void;
  value: InputValue;
  padZero?: boolean;
}

export interface UseNumericInputProps extends AbstractNumericInputProps {
  ref: ForwardedRef<HTMLInputElement>;
}

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  inputClassName?: string;
  hasError?: boolean;
  hint?: string;
  label?: string;
  hasFocus?: boolean;
  suffix?: string;
  unit?: string;
  value?: InputValue;
  isIndeterminate?: boolean;
  containerStyleOverride?: string;
}

export type NumericInputProps = InputProps & AbstractNumericInputProps;
