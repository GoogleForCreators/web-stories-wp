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
 * Preload video using a promise.
 *
 * @param {string} src Video source.
 * @return {Promise} Video object.
 */
const preloadVideo = (src) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => resolve(video);
    video.onerror = reject;
    video.crossOrigin = 'anonymous';
    video.src = src;
  });
};

/**
 * Get video length from an video.
 *
 * @param {string} src Image source.
 * @return {Promise} Image dimensions object.
 */
const getVideoLength = (src) => {
  return preloadVideo(src).then((video) => {
    const length = Math.round(video.duration);
    let lengthFormatted;
    const seconds = formatDuration(length % 60);
    let minutes = Math.floor(length / 60);
    const hours = Math.floor(minutes / 60);

    if (hours) {
      minutes = formatDuration(minutes % 60);
      lengthFormatted = `${hours}:${minutes}:${seconds}`;
    } else {
      lengthFormatted = `${minutes}:${seconds}`;
    }
    return {
      length,
      lengthFormatted,
    };
  });
};

export default getVideoLength;
