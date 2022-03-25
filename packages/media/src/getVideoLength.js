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
import getVideoLengthDisplay from './getVideoLengthDisplay';

/**
 * Get video length from a video.
 *
 * @param {HTMLVideoElement} video Video element.
 * @return {Object<{length: number, lengthFormatted: string}>} Video length information.
 */
function getVideoLength(video) {
  // If the element's media doesn't have a known duration—such as for live media streams—the value of duration is +Infinity.
  // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
  const isNumber = !isNaN(video.duration) && Infinity !== video.duration;
  const duration = isNumber ? video.duration : 0;
  const length = Math.round(duration);
  const lengthFormatted = getVideoLengthDisplay(length);
  return {
    length,
    lengthFormatted,
  };
}

export default getVideoLength;
