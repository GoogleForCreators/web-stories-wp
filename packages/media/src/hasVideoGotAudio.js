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

function hasAudio(video) {
  return (
    video.mozHasAudio ||
    Boolean(video.webkitAudioDecodedByteCount) ||
    Boolean(video.audioTracks?.length)
  );
}
function hasVideoGotAudio(src) {
  const video = document.createElement('video');
  video.muted = true;
  video.crossOrigin = 'anonymous';
  // Since  we want to get the actual frames, we need to make sure to preload the whole video
  // and not just metadata.
  // See https://github.com/google/web-stories-wp/issues/2922.
  video.preload = 'auto';

  return new Promise((resolve, reject) => {
    video.addEventListener('error', reject);

    video.addEventListener(
      'canplay',
      () => {
        video.currentTime = 0.99;
      },
      { once: true } // Important because 'canplay' can be fired hundreds of times.
    );

    video.addEventListener(
      'seeked',
      () => {
        const videoHasAudio = hasAudio(video);
        resolve(videoHasAudio);
      },
      { once: true }
    );

    video.src = src;
  });
}

export default hasVideoGotAudio;
