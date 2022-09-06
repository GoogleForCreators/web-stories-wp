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
import type { Hex, Pattern } from './types';

function colorHasTransparency(color: Hex) {
  return color.a !== undefined && color.a < 1;
}

function hasOpacity(pattern: Pattern) {
  if ('color' in pattern) {
    return Boolean(colorHasTransparency(pattern.color));
  }
  if (typeof pattern.alpha === 'number' && pattern.alpha < 1) {
    return true;
  }
  for (const colorStop of pattern.stops || []) {
    if (colorHasTransparency(colorStop.color)) {
      return true;
    }
  }
  return false;
}

export default hasOpacity;
