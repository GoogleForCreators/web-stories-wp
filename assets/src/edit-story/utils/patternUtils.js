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
 * Internal dependencies
 */
import createSolidFromString from './createSolidFromString';
import createSolid from './createSolid';

export function getSolidFromHex(hex) {
  // We already have a nice parser for most of this, but we need to
  // parse opacity as the last two hex digits as percent, not 1/256th

  const {
    color: { r, g, b },
  } = createSolidFromString(`#${hex.slice(0, 6)}`);

  const opacity = parseInt(hex.slice(6), 16);

  return createSolid(r, g, b, opacity / 100);
}

export function getHexFromSolid(solid) {
  const {
    color: { r, g, b, a = 1 },
  } = solid;
  const dims = [r, g, b, Math.round(a * 100)];
  return dims
    .map((n) => n.toString(16))
    .map((s) => s.padStart(2, '0'))
    .join('');
}
