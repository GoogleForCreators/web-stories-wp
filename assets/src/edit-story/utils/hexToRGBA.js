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

/**
 * Convert 6-digit hex to rgba value.
 *
 * @param {string} hex 6-digit hex value.
 * @param {number} opacity Opacity in %.
 */
function hexToRGBA(hex, opacity = 100) {
  // @todo is 3 digit hex needed?
  if (7 !== hex.length || '#' !== hex[0]) {
    return null;
  }
  const r = '0x' + hex[1] + hex[2];
  const g = '0x' + hex[3] + hex[4];
  const b = '0x' + hex[5] + hex[6];

  return `rgba(${Number(r)},${Number(g)},${Number(b)},${opacity / 100})`;
}

export default hexToRGBA;
