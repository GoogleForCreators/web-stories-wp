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
 * External dependencies
 */
import { preloadImage } from '@web-stories-wp/media';
import { getTimeTracker, trackError } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
// eslint-disable-next-line import/default
import Worker from './generateBlurhash.worker';

const getImageData = (image) => {
  const { width, height } = image;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, width, height);
};

const getBlurHashFromImage = async (src) => {
  const image = await preloadImage(src);
  const imageData = getImageData(image);
  const { data, width, height } = imageData;

  const trackTiming = getTimeTracker('load_get_blurhash');
  return new Promise((resolve, reject) => {
    const worker = new Worker(); // lgtm[js/call-to-non-callable]
    worker.postMessage({
      image: data,
      width,
      height,
      compontentX: 4,
      compontentY: 4,
    });
    worker.addEventListener('message', function (event) {
      worker.terminate(); // lgtm [js/property-access-on-non-object]
      trackTiming();
      if (event.data.type === 'success') {
        resolve(event.data.blurHash);
      } else {
        trackError('blurhash_generation', event.data.error?.message);
        reject(event.data.error);
      }
    });
    worker.addEventListener('error', (e) => {
      worker.terminate(); // lgtm [js/property-access-on-non-object]
      trackTiming();
      trackError('blurhash_generation', e?.message);
      reject(e);
    });
  });
};
export default getBlurHashFromImage;
