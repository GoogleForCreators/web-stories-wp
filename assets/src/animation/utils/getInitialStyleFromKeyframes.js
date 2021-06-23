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

const ALLOWLIST = ['opacity', 'transform'];

/**
 * Get a key-value pair of custom CSS properties based on keyframes.
 *
 * The styles are used in the output's style[amp-custom].
 *
 * @param {Array<Object>|Object} keyframes Keyframes.
 * @return {Object<string, string>} Key value pair of initial styles.
 */
function getInitialStyleFromKeyframes(keyframes) {
  const initialStyle = {};
  let frame = null;

  if (Array.isArray(keyframes)) {
    frame = keyframes[0];
  } else if (typeof keyframes === 'object') {
    frame = keyframes;
  }

  if (!frame) {
    return initialStyle;
  }

  Object.keys(frame).forEach((key) => {
    if (ALLOWLIST.includes(key.toLowerCase())) {
      const value = frame[key];
      initialStyle[`--initial-opacity`] = 1;
      initialStyle[`--initial-transform`] = 'none';
      if (Array.isArray(value)) {
        initialStyle[`--initial-${key}`] = value[0];
      } else {
        initialStyle[`--initial-${key}`] = value;
      }
    }
  });

  return initialStyle;
}

export default getInitialStyleFromKeyframes;
