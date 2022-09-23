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
 * Get video length to display from seconds.
 *
 * @param seconds Length in seconds.
 * @return Video length in H:MM:SS format.
 */
function getVideoLengthDisplay(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  if (hours) {
    return `${hours}:${formatDuration(minutes)}:${formatDuration(seconds)}`;
  }
  return `${minutes}:${formatDuration(seconds)}`;
}

export default getVideoLengthDisplay;
