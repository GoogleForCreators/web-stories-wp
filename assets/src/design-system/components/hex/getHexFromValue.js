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
  const val = (value || '').toUpperCase().trim().replace(/^#/, '');

  const hasNonHex = /[^0-9a-f]/i.test(val);
  if (hasNonHex) {
    return null;
  }

  // Normal Hex
  if (val.length === 6) {
    return val;
  }

  // Shorthand rules.
  // 2 => 222222
  if (val.length === 1) {
    return `${val}${val}${val}${val}${val}${val}`;
  }

  // 21 => 212121
  if (val.length === 2) {
    return `${val}${val}${val}`;
  }

  // 221 => 22221
  if (val.length === 3) {
    return val.replace(/./g, '$&$&');
  }

  // 2211 => 222211
  if (val.length === 4) {
    const first = val.substring(0, 2);
    return `${first}${first}${val.substring(2)}`;
  }

  return null;
}

export default getHexFromValue;
