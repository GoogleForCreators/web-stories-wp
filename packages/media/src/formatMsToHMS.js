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
 * Converts length in milliseconds to HH:MM:SS.SSS format.
 *
 * @param {number} ms Original length in milliseconds.
 * @return {string} Formatted length.
 */
function formatMsToHMS(ms) {
  if (!ms) {
    return '00:00:00';
  }
  let seconds = ms / 1000;
  const hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = parseInt(seconds / 60);
  seconds = seconds % 60;

  return `${formatDuration(hours)}:${formatDuration(minutes)}:${formatDuration(
    seconds
  )}`;
}

export default formatMsToHMS;
