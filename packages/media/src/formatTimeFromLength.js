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
import formatDuration from './formatDuration';

/**
 * Format time to be human readable
 *
 * @param {number} length Length in seconds.
 * @return string
 */
const formatTimeFromLength = ( length ) => {
  const seconds = formatDuration(length % 60);
  let minutes = Math.floor(length / 60);
  const hours = Math.floor(minutes / 60);

  if (hours) {
    minutes = formatDuration(minutes % 60);
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}
export default formatTimeFromLength;
