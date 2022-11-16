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
import type { CSSVariables, Keyframes, Property } from '../types';

const ALLOWLIST = ['opacity', 'transform'];

/**
 * Get a key-value pair of custom CSS properties based on keyframes.
 *
 * The styles are used in the output's style[amp-custom].
 *
 * @param keyframes Keyframes.
 * @return Key value pair of initial styles.
 */
function getInitialStyleFromKeyframes(keyframes: Keyframes) {
  const initialStyle: CSSVariables = {};
  let frame: Keyframe | null = null;

  if (Array.isArray(keyframes)) {
    frame = keyframes[0];
  } else if (typeof keyframes === 'object') {
    frame = keyframes as Keyframe;
  }

  if (!frame) {
    return initialStyle;
  }

  // Set initial opacity and transforms so that
  // unspecified opacity & transforms aren't inherited
  initialStyle['--initial-opacity'] = 1;
  initialStyle[`--initial-transform`] = 'none';

  Object.entries(frame).forEach(([key, value]) => {
    if (ALLOWLIST.includes(key.toLowerCase())) {
      if (Array.isArray(value)) {
        initialStyle[`--initial-${key}`] = value[0] as Property;
      } else {
        initialStyle[`--initial-${key}`] = value as Property;
      }
    }
  });

  return initialStyle;
}

export default getInitialStyleFromKeyframes;
