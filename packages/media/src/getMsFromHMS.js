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
 * Converts time in H:M:S format to milliseconds.
 *
 * @param {string} time Time in HH:MM:SS or H:M:S format.
 * @return {number} Milliseconds.
 */
function getMsFromHMS(time) {
  if (!time) {
    return 0;
  }
  const parts = time.split(':');
  if (parts.length !== 3) {
    return 0;
  }
  const seconds =
    parseFloat(parts[2]) + parseInt(parts[1]) * 60 + parseInt(parts[0]) * 3600;
  return Math.round(1000 * seconds);
}

export default getMsFromHMS;
