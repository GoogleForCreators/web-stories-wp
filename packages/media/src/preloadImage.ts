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

interface ImageArguments {
  src: string;
  srcset?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * Preload image using a promise.
 *
 * @param {Object} attr Image attributes
 * @param {string} attr.src Image source.
 * @param {string} attr.srcset Image source set.
 * @param {number|string} attr.width Image width.
 * @param {number|string} attr.height Image height.
 * @return {Promise} Image object.
 */
function preloadImage({
  src,
  srcset,
  width,
  height,
}: ImageArguments): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image(Number(width), Number(height));
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    if (srcset) {
      image.srcset = srcset;
    }
    image.src = src;
  });
}

export default preloadImage;
