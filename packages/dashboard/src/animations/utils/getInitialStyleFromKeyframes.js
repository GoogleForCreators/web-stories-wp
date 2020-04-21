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

const IGNORE_LIST = new Set(['easing', 'offset', 'composite']);

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
    if (!IGNORE_LIST.has(key.toLowerCase())) {
      const value = frame[key];
      if (Array.isArray(value)) {
        initialStyle[key] = value[0];
      } else {
        initialStyle[key] = value;
      }
    }
  });

  return initialStyle;
}

export default getInitialStyleFromKeyframes;
