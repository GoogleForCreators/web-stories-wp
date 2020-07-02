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

/**
 * Returns an image of the first frame of a given video.
 *
 * @see https://github.com/ampproject/amp-wp/blob/c5fba13dd17d4f713c9889d26898aec6091e421b/assets/src/stories-editor/helpers/uploadVideoFrame.js#L10-L39
 *
 * @param {string} src Video src URL.
 * @return {Promise<string>} The extracted image in base64-encoded format.
 */
function getFirstFrameOfVideo(src) {
  const video = document.createElement('video');
  video.muted = true;
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';

  return new Promise((resolve, reject) => {
    video.addEventListener('error', reject);

    video.addEventListener(
      'canplay',
      () => {
        video.currentTime = 0.5; // Needed to seek forward.

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(resolve, 'image/jpeg');
      },
      { once: true } // Important because 'canplay' can be fired hundreds of times.
    );

    video.src = src;
  });
}

export default getFirstFrameOfVideo;
