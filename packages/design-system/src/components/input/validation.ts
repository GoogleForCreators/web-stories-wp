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
 * Internal dependencies
 */
import type { InputValue, ParseInputProps } from './types';

export function parseInput(
  value: InputValue,
  { allowEmpty, isFloat, min, max }: ParseInputProps
) {
  if (`${String(value)}`.length > 0) {
    let boundedValue = isFloat
      ? parseFloat(String(value))
      : parseInt(String(value));

    if (min !== undefined) {
      boundedValue = Math.max(min, boundedValue);
    }
    if (max !== undefined) {
      boundedValue = Math.min(max, boundedValue);
    }

    return !isNaN(boundedValue) ? boundedValue : null;
  } else if (allowEmpty) {
    return '';
  }

  return null;
}

export function isInputValid(
  value: InputValue,
  { allowEmpty, isFloat, min, max }: ParseInputProps
) {
  if (allowEmpty && `${String(value)}`.length === 0) {
    return true;
  }

  const valueAsANumber = isFloat
    ? parseFloat(String(value))
    : parseInt(String(value));

  if (min !== undefined && valueAsANumber < min) {
    return false;
  }
  if (max !== undefined && valueAsANumber > max) {
    return false;
  }

  return !isNaN(valueAsANumber);
}
