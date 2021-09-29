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
import preloadVideoMetadata from './preloadVideoMetadata';
import getVideoLengthFromDisplay from './getVideoLengthDisplay';

/**
 * Get video length from a video.
 *
 * @param {string} src Video source.
 * @return {Promise} Video length object.
 */
const getVideoLength = async (src) => {
  const video = await preloadVideoMetadata(src);
  const length = Math.round(video.duration);
  const lengthFormatted = getVideoLengthFromDisplay(length);
  return {
    length,
    lengthFormatted,
  };
};

export default getVideoLength;
