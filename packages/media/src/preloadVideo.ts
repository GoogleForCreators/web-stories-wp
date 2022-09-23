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

/**
 * Preload a video.
 *
 * @param src Video source.
 * @return Video element.
 */
async function preloadVideo(src: string): Promise<HTMLVideoElement> {
  const video = await preloadVideoMetadata(src);

  return new Promise((resolve, reject) => {
    video.addEventListener('canplay', () => resolve(video), { once: true });
    video.addEventListener('error', reject);

    video.preload = 'auto';
  });
}

export default preloadVideo;
