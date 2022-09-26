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

export function parseInput(value, { allowEmpty, isFloat, min, max }) {
  if (`${value}`.length > 0) {
    let boundedValue = isFloat ? parseFloat(value) : parseInt(value);

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
