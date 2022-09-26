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
 * External dependencies
 */
import { encode } from 'blurhash';

const callback = function (event) {
  const { image, width, height, componentX, componentY } = event.data;

  // Bail early if the message is not for us.
  if (!image) {
    return;
  }

  try {
    const blurHash = encode(image, width, height, componentX, componentY);
    postMessage({
      type: 'success',
      blurHash,
    });
  } catch (error) {
    postMessage({
      type: 'error',
      error,
    });
  }
};

self.addEventListener('message', callback);

// Only needed for Rollup, not webpack v4.
export default { callback };
