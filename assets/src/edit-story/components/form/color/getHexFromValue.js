/*
 * Copyright 2020 Google LLC
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

function getHexFromValue(value) {
  const val = value.trim().replace(/^#/, '');

  const hasNonHex = /[^0-9a-f]/i.test(val);
  if (hasNonHex) {
    return null;
  }

  // Normal Hex
  if (val.length === 6) {
    return val;
  } else if (val.length === 3) {
    // Shorthand hex
    return val.split('').reduce((hex, char) => `${hex}${char}${char}`, '');
  }

  return null;
}

export default getHexFromValue;
