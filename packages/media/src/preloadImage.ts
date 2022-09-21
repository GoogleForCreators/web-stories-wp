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
 * @param attr Image attributes
 * @param attr.src Image source.
 * @param attr.srcset Image source set.
 * @param attr.width Image width.
 * @param attr.height Image height.
 * @return Image object.
 */
function preloadImage({
  src,
  srcset,
  width,
  height,
}: ImageArguments): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // If no width or height are provided, set them to undefined
    // so that is preloaded with its full dimensions.
    // Avoids creating an image with 0x0 dimensions.
    const image = new window.Image(
      Number(width) || undefined,
      Number(height) || undefined
    );
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
